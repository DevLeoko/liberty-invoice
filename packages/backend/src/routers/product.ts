import { z } from "zod";
import { CURRENCIES } from "../../../shared/currencies";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { TError } from "../utils/TError";

export const productInputSchema = z.object({
  name: z.string(),
  description: z.string(),
  unitPrice: z.number(),
  unit: z.string(),
  stockedUnits: z.number().nullable(),
  currency: z.enum(["USD", ...CURRENCIES.map((c) => c.shorthand)]),
});

export const productRouter = router({
  read: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const product = await prisma.product.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!product || product.user.id !== ctx.userId)
        throw new TError("error.product.notFound");

      return product;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.product.findMany({
      where: {
        userId: ctx.userId,
      },
    });
  }),

  create: protectedProcedure
    .input(productInputSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.product.create({
        data: {
          ...input,
          userId: ctx.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.string(), product: productInputSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      const product = await prisma.product.findUnique({
        where: { id: input.id },
      });

      if (!product || product.userId !== ctx.userId)
        throw new TError("error.product.notFound");

      return await prisma.product.update({
        where: {
          id: input.id,
        },
        data: {
          ...{ ...input.product },
        },
      });
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await prisma.product.deleteMany({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });
    }),
});
