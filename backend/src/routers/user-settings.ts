import { z } from "zod";
import { clientInputSchema } from "./client-schema";
import { protectedProcedure, router } from "../trpc";
import { prisma } from "../prisma";

const userSettingsInputSchema = clientInputSchema.extend({
  logoUrl: z.string(),
  bankName: z.string(),
  iban: z.string(),
  bic: z.string(),

  idFormat: z.string(),
  partialIdCount: z.number(),
  partialIdDate: z.date(),
  enableTaxPerItem: z.boolean(),
  enableMultilingual: z.boolean(),
});

export const userSettingsRouter = router({
  read: protectedProcedure.query(async ({ ctx }) => {
    return prisma.userSettings.findUnique({
      where: {
        userId: ctx.userId,
      },
    });
  }),

  update: protectedProcedure
    .input(
      z.object({ id: z.number(), settings: userSettingsInputSchema.partial() })
    )
    .mutation(async ({ ctx, input }) => {
      return prisma.userSettings.update({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        data: {
          ...input,
        },
      });
    }),
});
