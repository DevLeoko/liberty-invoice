import { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../../prisma";
import { buildInvoicePdf } from "../../utils/pdf/invoice-pdf";

const downloadQuerySchema = z.object({
  invoiceId: z.coerce.number().int(),
  downloadType: z.enum(["inline", "attachment"]).default("inline"),
});

export async function invoiceDownloadHandler(req: Request, res: Response) {
  const query = downloadQuerySchema.parse({
    ...req.query,
    invoiceId: req.params.invoiceId,
  });

  const invoice = await prisma.invoice.findUnique({
    where: { id: query.invoiceId },
    include: {
      user: {
        include: {
          userSettings: true,
        },
      },
      client: true,
      items: true,
      taxRates: true,
    },
  });

  if (!invoice || invoice.user.id !== req.userId) {
    res.status(404).send("Not found");
    return;
  }

  const pdfBuffer = await buildInvoicePdf(invoice);

  let filename = `${invoice.invoiceNumber}`;
  if (invoice.client.shorthand) filename += `-${invoice.client.shorthand}`;

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `${query.downloadType}; filename=${filename}.pdf`
  );

  res.send(pdfBuffer);
}
