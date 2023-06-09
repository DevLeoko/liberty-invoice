import { z } from "zod";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { clientInputSchema } from "./client-schema";

export const clientRouter = router({
  read: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const client = await prisma.client.findUnique({
        where: {
          id: input.id,
        },
        include: {
          user: {
            select: {
              id: true,
            },
          },
          textFragments: {
            select: {
              key: true,
              value: true,
            },
          },
        },
      });

      if (!client || client.user.id !== ctx.userId)
        throw new Error("error.client.notFound");

      return client;
    }),

  readDefaults: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const client = await prisma.client.findUnique({
        where: {
          id: input.id,
        },
        select: {
          defaultCurrency: true,
          defaultDueDays: true,
          defaultLanguage: true,
          defaultTaxRateId: true,
          userId: true,
        },
      });

      if (!client || client.userId !== ctx.userId)
        throw new Error("error.client.notFound");

      return client;
    }),

  list: protectedProcedure.query(async ({ ctx }) => {
    return prisma.client.findMany({
      where: {
        userId: ctx.userId,
      },
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        shorthand: true,
      },
    });
  }),

  create: protectedProcedure
    .input(clientInputSchema)
    .mutation(async ({ ctx, input }) => {
      return prisma.client.create({
        data: {
          ...input,
          textFragments: {
            createMany: {
              data: input.textFragments.map((fragment) => ({
                userId: ctx.userId,
                key: fragment.key,
                value: fragment.value,
                language: null,
              })),
            },
          },
          userId: ctx.userId,
        },
      });
    }),

  update: protectedProcedure
    .input(z.object({ id: z.number(), client: clientInputSchema.partial() }))
    .mutation(async ({ ctx, input }) => {
      await prisma.client.updateMany({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
        data: {
          ...{ ...input.client, textFragments: undefined },
        },
      });

      if (input.client?.textFragments) {
        await prisma.textFragment.deleteMany({
          where: {
            clientId: input.id,
            userId: ctx.userId,
          },
        });

        await prisma.textFragment.createMany({
          data: input.client.textFragments.map((fragment) => ({
            clientId: input.id,
            key: fragment.key,
            value: fragment.value,
            language: null,
            userId: ctx.userId,
          })),
        });
      }
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      await prisma.client.deleteMany({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });
    }),
});
