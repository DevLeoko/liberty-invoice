import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { TError } from "../utils/TError";

export const taxRateRouter = router({
  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.taxRate.findMany({
      where: {
        userId: ctx.userId,
      },
    });
  }),

  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        displayText: z.string(),
        rate: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.taxRate.create({
        data: {
          userId: ctx.userId,
          name: input.name,
          displayText: input.displayText,
          rate: input.rate,
        },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
        name: z.string(),
        displayText: z.string(),
        rate: z.number(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const taxRate = await prisma.taxRate.findUnique({
        where: { id: input.id },
      });

      if (!taxRate || taxRate.userId !== ctx.userId) {
        throw new TError("error.internalServerError");
      }

      return prisma.taxRate.update({
        where: {
          id: input.id,
        },
        data: {
          name: input.name,
          displayText: input.displayText,
          rate: input.rate,
        },
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.number().int(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.taxRate.deleteMany({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });
    }),
});
