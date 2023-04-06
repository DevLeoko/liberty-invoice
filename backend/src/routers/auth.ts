import type { User } from "@prisma/client";
import { z } from "zod";
import { publicProcedure, router } from "../trpc";
import {
  loginWithPassword,
  requestPasswordReset,
  resetPassword,
  signUpWithPassword,
  verifyMailToken,
} from "../controller/auth-flows";

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
      await requestPasswordReset(input.email);
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
});
