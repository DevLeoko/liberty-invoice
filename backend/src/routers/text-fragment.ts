import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { TError } from "../utils/TError";

export const textFragmentRouter = router({
  listDefaults: protectedProcedure
    .input(
      z.object({
        language: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return prisma.textFragment.findMany({
        where: {
          userId: ctx.userId,
          language: input.language,
          clientId: null,
        },
      });
    }),

  listForClient: protectedProcedure
    .input(
      z.object({
        clientId: z.number().int(),
        language: z.string(),
        keys: z.array(z.string()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { clientId, language, keys } = input;

      const textFragments = await prisma.textFragment.findMany({
        where: {
          userId: ctx.userId,
          key: keys
            ? {
                in: keys,
              }
            : undefined,
          OR: [
            {
              clientId: clientId,
            },
            {
              language: language,
            },
          ],
        },
      });

      const clientFragments = textFragments.filter(
        (textFragment) => textFragment.clientId === clientId
      );
      const defaultFragments = textFragments.filter(
        (textFragment) =>
          textFragment.clientId === null &&
          !clientFragments.some(
            (clientFragment) => clientFragment.key === textFragment.key
          )
      );

      return [...clientFragments, ...defaultFragments];
    }),

  delete: protectedProcedure
    .input(
      z.object({
        clientId: z.number().int().nullable(),
        language: z.string().nullable(),
        key: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await prisma.textFragment.deleteMany({
        where: {
          userId: ctx.userId,
          clientId: input.clientId,
          language: input.language,
          key: input.key,
        },
      });
    }),

  upsert: protectedProcedure
    .input(
      z.object({
        language: z.string().nullable(),
        clientId: z.number().int().nullable(),
        key: z.string(),
        value: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { language, clientId, key, value } = input;

      if (language && clientId) {
        throw new TError("error.invalidInput");
      }

      const textFragment = await prisma.textFragment.findMany({
        where: {
          userId: ctx.userId,
          clientId,
          language,
          key,
        },
        select: {
          id: true,
        },
      });

      if (textFragment.length) {
        return prisma.textFragment.update({
          where: {
            id: textFragment[0].id,
          },
          data: {
            value,
          },
        });
      } else {
        return prisma.textFragment.create({
          data: {
            language,
            clientId,
            key,
            value,
            userId: ctx.userId,
          },
        });
      }
    }),
});
