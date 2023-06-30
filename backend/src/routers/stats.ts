import { z } from "zod";
import { CURRENCIES } from "../../../shared/currencies";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";

const ALLOWED_CURRENCIES = CURRENCIES.map((c) => c.shorthand);

export const statsRouter = router({
  aggregations: protectedProcedure
    .input(
      z.object({
        baseCurrency: z.enum(["USD", ...ALLOWED_CURRENCIES]),
      })
    )
    .query(async ({ ctx, input }) => {
      const { baseCurrency } = input;

      const thisMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const nextMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        1
      );

      const invoicesThisMonth = prisma.invoice.count({
        where: {
          userId: ctx.userId,
          date: {
            gte: thisMonth,
            lt: nextMonth,
          },
        },
      });

      const outstandingInvoices = prisma.invoice.count({
        where: {
          userId: ctx.userId,
          amountPaid: {
            not: {
              equals: prisma.invoice.fields.amountWithTax,
            },
          },
        },
      });

      const overdueInvoices = prisma.invoice.count({
        where: {
          userId: ctx.userId,
          amountPaid: {
            not: {
              equals: prisma.invoice.fields.amountWithTax,
            },
          },
          dueDate: {
            lt: new Date(),
          },
        },
      });

      const revenueThisMonth = prisma.$queryRaw<
        { sum: number }[]
      >`SELECT SUM(IF(currency = ${baseCurrency}, amountWithoutTax, amountWithoutTax * currencyexchangerates.rate)) as sum 
      FROM invoice 
      LEFT JOIN currencyexchangerates ON invoice.currency = currencyexchangerates.fromCurrency AND currencyexchangerates.toCurrency = ${baseCurrency} 
      WHERE userId = ${ctx.userId} AND date >= ${thisMonth} AND date < ${nextMonth}`;

      const results = await Promise.all([
        invoicesThisMonth,
        outstandingInvoices,
        overdueInvoices,
        revenueThisMonth,
      ]);

      return {
        invoicesThisMonth: results[0],
        outstandingInvoices: results[1],
        overdueInvoices: results[2],
        revenueThisMonth: results[3][0].sum ?? 0,
      };
    }),
});
