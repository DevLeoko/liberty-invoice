import type { inferRouterInputs, inferRouterOutputs } from "@trpc/server";
import { router } from "../trpc";
import { authRouter } from "./auth";
import { clientRouter } from "./client";
import { userSettingsRouter } from "./user-settings";
import { invoiceRouter } from "./invoice";

export const appRouter = router({
  auth: authRouter,
  client: clientRouter,
  userSettings: userSettingsRouter,
  invoice: invoiceRouter,
});

export type AppRouter = typeof appRouter;
export type RouterOutput = inferRouterOutputs<AppRouter>;
export type RouterInput = inferRouterInputs<AppRouter>;
