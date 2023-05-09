import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { invoiceCreateSchema } from "./invoice-schemas";
import {
  claimInvoiceId,
  getNextAvailablePartialId,
} from "../controller/invoice-ids";

export const invoiceRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.invoice.findMany({
      where: {
        userId: ctx.userId,
      },
      orderBy: {
        date: "desc",
      },
      include: {
        client: {
          select: {
            name: true,
            firstName: true,
            lastName: true,
          },
        },
        items: true,
        taxRates: true,
      },
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

      if (partialId) {
        const success = await claimInvoiceId(ctx.userId, partialId);
        if (!success) {
          throw new Error("error.invoice.partialIdAlreadyClaimed");
        }
      }

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
          grossAmount: 0,
          paidAmount: 0,
        },
        include: {
          client: true,
          items: true,
          taxRates: true,
        },
      });
    }),

  getNextAvailablePartialInvoiceId: protectedProcedure.query(
    async ({ ctx }) => {
      return await getNextAvailablePartialId(ctx.userId);
    }
  ),
});
