import { Prisma } from "@prisma/client";
import { z } from "zod";
import {
  computeTotalExcludingTax,
  computeTotalWithTax,
} from "../../../shared/invoice-computations";
import {
  claimInvoiceId,
  getNextAvailablePartialId,
} from "../controller/invoice-ids";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { invoiceCreateSchema } from "./invoice-schemas";

const LIST_INVOICE_DEFAULT_INCLUDES = {
  client: {
    select: {
      name: true,
      firstName: true,
      lastName: true,
    },
  },
  items: true,
  taxRates: {
    select: {
      id: true,
    },
  },
} satisfies Prisma.InvoiceInclude;

async function verifyInvoiceOwnership(invoiceId: number, userId: number) {
  const invoice = await prisma.invoice.findUnique({
    where: {
      id: invoiceId,
    },
    select: {
      userId: true,
    },
  });

  if (invoice?.userId !== userId) {
    throw new Error("error.invoice.notFound");
  }
}

export const invoiceRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.invoice.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        date: "desc",
      },
      include: LIST_INVOICE_DEFAULT_INCLUDES,
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        partialId: z.number().int().optional(),
        invoice: invoiceCreateSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { partialId, invoice } = input;

      if (partialId != undefined) {
        const success = await claimInvoiceId(ctx.userId, partialId);
        if (!success) {
          throw new Error("error.invoice.partialIdAlreadyClaimed");
        }
      }

      try {
        return prisma.invoice.create({
          data: {
            userId: ctx.userId,
            clientId: invoice.clientId,
            invoiceNumber: invoice.invoiceNumber,
            date: invoice.date,
            dueDate: invoice.dueDate,
            currency: invoice.currency,
            language: invoice.language,
            taxRates: {
              connect: invoice.taxRateIds.map((id) => ({ id })),
            },
            note: invoice.note,
            items: {
              create: invoice.items.map((item) => ({
                ...item,

                userId: ctx.userId,
              })),
            },
            amountWithoutTax: computeTotalExcludingTax(invoice),
            amountWithTax: computeTotalWithTax({
              ...invoice,
              taxRates: await prisma.taxRate.findMany({
                where: { id: { in: invoice.taxRateIds } },
              }),
            }),
            amountPaid: 0,
          },
          include: {
            client: true,
            items: true,
            taxRates: {
              select: {
                id: true,
              },
            },
          },
        });
      } catch (e: any) {
        // Duplicate invoice number
        if (e.code === "P2002") {
          throw new Error("error.invoice.partialIdAlreadyClaimed");
        }

        throw e;
      }
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        invoice: invoiceCreateSchema,
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, invoice } = input;

      const existingInvoice = await prisma.invoice.findUnique({
        where: {
          id,
        },
        select: {
          userId: true,
        },
      });

      if (existingInvoice?.userId !== ctx.userId) {
        throw new Error("error.invoice.notFound");
      }

      const updatedInvoice = await prisma.invoice.update({
        where: {
          id,
        },
        data: {
          clientId: invoice.clientId,
          invoiceNumber: invoice.invoiceNumber,
          date: invoice.date,
          dueDate: invoice.dueDate,
          currency: invoice.currency,
          language: invoice.language,
          taxRates: {
            connect: invoice.taxRateIds.map((id) => ({ id })),
          },
          note: invoice.note,
          items: {
            deleteMany: {},
            create: invoice.items.map((item) => ({
              ...item,

              userId: ctx.userId,
            })),
          },
          amountWithoutTax: computeTotalExcludingTax(invoice),
          amountWithTax: computeTotalWithTax({
            ...invoice,
            taxRates: await prisma.taxRate.findMany({
              where: { id: { in: invoice.taxRateIds } },
            }),
          }),
        },
        include: {
          client: true,
          items: true,
          taxRates: {
            select: {
              id: true,
            },
          },
        },
      });

      return updatedInvoice;
    }),

  delete: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ ctx, input }) => {
      await verifyInvoiceOwnership(input, ctx.userId);

      await prisma.invoice.delete({
        where: {
          id: input,
        },
      });
    }),

  read: protectedProcedure
    .input(z.number().int())
    .query(async ({ input, ctx }) => {
      const invoice = await prisma.invoice.findUnique({
        where: {
          id: input,
        },
        include: {
          client: true,
          items: true,
          taxRates: {
            select: {
              id: true,
            },
          },
        },
      });

      if (invoice?.userId !== ctx.userId) {
        throw new Error("error.invoice.notFound");
      }

      return invoice;
    }),

  finalize: protectedProcedure
    .input(z.number().int())
    .mutation(async ({ input, ctx }) => {
      await verifyInvoiceOwnership(input, ctx.userId);

      const products = await prisma.invoiceItem.findMany({
        where: {
          invoiceId: input,
          product: {
            stockedUnits: {
              not: {
                equals: null,
              },
            },
          },
        },
        select: {
          quantity: true,
          productId: true,
        },
      });

      const results = await prisma.$transaction([
        ...products.map((product) =>
          prisma.product.update({
            where: {
              id: product.productId!,
            },
            data: {
              stockedUnits: {
                decrement: product.quantity,
              },
            },
          })
        ),
        prisma.invoice.update({
          where: {
            id: input,
          },
          data: {
            draft: false,
          },
          include: LIST_INVOICE_DEFAULT_INCLUDES,
        }),
      ]);

      return results[results.length - 1];
    }),

  logPayment: protectedProcedure
    .input(z.object({ id: z.number().int(), amount: z.number() }))
    .mutation(async ({ input, ctx }) => {
      await verifyInvoiceOwnership(input.id, ctx.userId);

      return await prisma.invoice.update({
        where: {
          id: input.id,
        },
        data: {
          amountPaid: {
            increment: input.amount,
          },
        },
        include: LIST_INVOICE_DEFAULT_INCLUDES,
      });
    }),

  getNextAvailablePartialInvoiceId: protectedProcedure.query(
    async ({ ctx }) => {
      return await getNextAvailablePartialId(ctx.userId);
    }
  ),
});
