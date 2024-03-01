import { initTRPC } from "@trpc/server";
import { Response } from "express";
import SuperJSON from "superjson";
import { TError } from "./utils/TError";

const t = initTRPC.context<{ userId?: string; res: Response }>().create({
  transformer: SuperJSON,
});

const isAuthenticated = t.middleware(({ next, ctx }) => {
  if (ctx.userId == undefined) {
    throw new TError("error.notAuthenticated");
  }

  return next({
    ctx: {
      userId: ctx.userId!,
      res: ctx.res,
    },
  });
});

export const middleware = t.middleware;
export const router = t.router;
export const mergeRouters = t.mergeRouters;

export const publicProcedure = t.procedure;

export const protectedProcedure = t.procedure.use(isAuthenticated);
