import { z } from "zod";

export const invoiceItemCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
  unit: z.string(),
  unitPrice: z.number(),
  discount: z.number(),
});

export const invoiceCreateSchema = z.object({
  clientId: z.number(),
  invoiceNumber: z.string(),
  date: z.date(),
  dueDate: z.date(),
  currency: z.string(),
  language: z.string(),
  taxRateIds: z.array(z.number()),
  note: z.string(),
  items: z.array(invoiceItemCreateSchema),
});
