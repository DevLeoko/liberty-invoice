import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { invoiceCreateSchema } from "./invoice-schemas";

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
    .input(invoiceCreateSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.invoice.create({
        data: {
          userId: ctx.userId,
          clientId: input.clientId,
          invoiceNumber: input.invoiceNumber,
          date: input.date,
          dueDate: input.dueDate,
          currency: input.currency,
          language: input.language,
          taxRates: {
            connect: input.taxRateIds.map((id) => ({ id })),
          },
          note: input.note,
          items: {
            create: input.items,
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
});
