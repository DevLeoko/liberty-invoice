/// <reference path="./types/env.d.ts" />

import "dotenv-safe/config";

process.env.TZ = "Europe/Vienna";

import * as trpcExpress from "@trpc/server/adapters/express";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response } from "express";
import multer from "multer";
import { authExpressMiddleware } from "./controller/auth-flows";
import { appRouter } from "./routers/_app";
import { invoiceDownloadHandler } from "./routers/non-trpc/invoice-download";
import {
  logoUploadHandler,
  logoViewHandler,
} from "./routers/non-trpc/logo-handler";
import { setupCurrencies } from "./utils/currencySetup";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(cookieParser());

app.use(authExpressMiddleware);

function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

app.get("/invoices/:invoiceId/download", asyncHandler(invoiceDownloadHandler));
app.post(
  "/logo/upload",
  multer({
    limits: {
      fileSize: 1024 * 1024 * 2,
    },
  }).single("file"),
  asyncHandler(logoUploadHandler)
);
app.get("/logo", asyncHandler(logoViewHandler));

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

setupCurrencies().then(() => {
  console.log("✅ Currencies setup");
});

app.listen(process.env.PORT, () => {
  console.log(`\n📄 Server ready on port ${process.env.PORT}\n`);
});
