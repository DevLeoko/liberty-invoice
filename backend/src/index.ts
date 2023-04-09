/// <reference path="./types/env.d.ts" />

import "dotenv-safe/config";

process.env.TZ = "Europe/Vienna";

import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers/_app";
import cors from "cors";
import { authExpressMiddleware } from "./controller/auth-flows";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({ origin: process.env.CORS_ORIGIN, credentials: true }));

app.use(cookieParser());

app.use(authExpressMiddleware);

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

// function errorHandler(
//   routeHandler: (req: Request, res: Response) => Promise<unknown>
// ) {
//   return (req: Request, res: Response) => {
//     routeHandler(req, res).catch((err) => {
//       if (err.message?.startsWith("error.")) {
//         res.status(400).json({ success: false, message: err.message });
//         return;
//       }

//       console.error(err);
//       res
//         .status(500)
//         .json({ success: false, message: "error.internalServerError" });
//     });
//   };
// }

// app.post("/upload", multer().array("files"), errorHandler(uploadHandler));
// app.post("/download", json(), errorHandler(downloadHandler));

app.listen(8080, () => {
  console.log("\n📄 Server ready on port 8080\n");
});
