import { z } from "zod";

export const invoiceItemCreateSchema = z.object({
  name: z.string(),
  description: z.string(),
  quantity: z.number(),
  price: z.number(),
  discount: z.number(),
});

export const invoiceCreateSchema = z.object({
  clientId: z.number(),
  invoiceNumber: z.string(),
  date: z.string(),
  dueDate: z.string(),
  currency: z.string(),
  language: z.string(),
  taxRateIds: z.array(z.number()),
  note: z.string(),
  items: z.array(invoiceItemCreateSchema),
});
