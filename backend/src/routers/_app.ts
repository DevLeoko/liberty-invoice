import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc";
import { appointmentRouter } from "./appointment";
import { authRouter } from "./auth";
import { chatRouter } from "./chat";
import { familyRouter } from "./family/family";
import { fileRouter } from "./file";
import { userRouter } from "./user";
import { worktimeRouter } from "./worktime";

export const appRouter = router({
  user: userRouter,
  auth: authRouter,
  family: familyRouter,
  appointment: appointmentRouter,
  file: fileRouter,
  chat: chatRouter,
  worktime: worktimeRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
