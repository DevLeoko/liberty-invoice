/// <reference path="./types/env.d.ts" />

import "dotenv-safe/config";

process.env.TZ = "Europe/Vienna";

import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { authExpressMiddleware } from "./controller/auth-flows";
import { appRouter } from "./routers/_app";
import { invoiceDownloadHandler } from "./routers/non-trpc/invoice-download";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(cookieParser());

app.use(authExpressMiddleware);

app.get("/invoices/:invoiceId/download", invoiceDownloadHandler);

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

app.listen(process.env.PORT, () => {
  console.log(`\n📄 Server ready on port ${process.env.PORT}\n`);
});
