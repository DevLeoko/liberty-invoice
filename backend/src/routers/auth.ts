import { z } from "zod";
import {
  loginWithPassword,
  requestPasswordReset,
  resetPassword,
  signUpWithPassword,
  verifyMailToken,
} from "../controller/auth-flows";
import { prisma } from "../prisma";
import { protectedProcedure, publicProcedure, router } from "../trpc";

export const authRouter = router({
  loginWithPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { accessToken, refreshToken } = await loginWithPassword(
        input.email,
        input.password
      );

      ctx.res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      ctx.res.cookie("accessToken", accessToken, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });
    }),

  signUpWithPassword: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      await signUpWithPassword(input.email, input.password);
    }),

  verifyEmail: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      await verifyMailToken(input.token, input.email);
    }),

  // TODO: add google recaptcha check for public reset requests
  requestPasswordReset: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
      })
    )
    .mutation(async ({ input }) => {
      const user = await prisma.user.findUnique({
        where: { email: input.email },
        select: { email: true },
      });

      if (user) {
        await requestPasswordReset(input.email);
      } // We don't want to leak if a user exists or not
    }),

  requestPasswordResetNoCaptcha: protectedProcedure
    .input(z.object({ signOutAllDevices: z.boolean() }))
    .mutation(async ({ ctx, input }) => {
      const user = await prisma.user.findUnique({
        where: { id: ctx.userId },
        select: { email: true, passwordHash: true },
      });

      if (!user || !user.passwordHash) {
        throw new Error("error.error");
      }

      if (input.signOutAllDevices) {
        await prisma.user.update({
          where: { id: ctx.userId },
          data: { refreshSession: null },
        });
      }

      await requestPasswordReset(user.email);
    }),

  resetPassword: publicProcedure
    .input(
      z.object({
        token: z.string(),
        email: z.string().email(),
        password: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      await resetPassword(input);
    }),

  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await prisma.user.findUnique({
      where: { id: ctx.userId },
      select: { email: true, passwordHash: true },
    });

    if (!user) {
      throw new Error("error.error");
    }

    return { email: user.email, isPasswordAccount: !!user.passwordHash };
  }),
});
