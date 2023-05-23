/// <reference path="./types/env.d.ts" />

import "dotenv-safe/config";

process.env.TZ = "Europe/Vienna";

import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers/_app";
import cors from "cors";
import { authExpressMiddleware } from "./controller/auth-flows";
import cookieParser from "cookie-parser";
import { invoiceDownloadHandler } from "./routers/non-trpc/invoice-download";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(cookieParser());

app.use(authExpressMiddleware);

app.get("/invoice/:invoiceId/download", invoiceDownloadHandler);

app.use(
  "/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => {
      return { userId: req.userId, res };
    },
    onError(data) {
      if (data.error.message?.startsWith("error.")) return;

      console.error(data.error);
      data.error.message = "error.internalServerError";
    },
  })
);

app.listen(8080, () => {
  console.log("\n📄 Server ready on port 8080\n");
});
