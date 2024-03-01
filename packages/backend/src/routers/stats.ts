import { z } from "zod";
import { CURRENCIES } from "../../../shared/currencies";
import { prisma } from "../prisma";
import { protectedProcedure, router } from "../trpc";
import { TError } from "../utils/TError";

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
      >`SELECT SUM(IF(currency = ${baseCurrency}, amountWithoutTax, amountWithoutTax * CurrencyExchangeRates.rate)) as sum 
      FROM Invoice 
      LEFT JOIN CurrencyExchangeRates ON Invoice.currency = CurrencyExchangeRates.fromCurrency AND CurrencyExchangeRates.toCurrency = ${baseCurrency} 
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

  revenue: protectedProcedure
    .input(
      z.object({
        baseCurrency: z.enum(["USD", ...ALLOWED_CURRENCIES]),
        from: z.date(),
        to: z.date(),
        interval: z.enum(["month", "day"]),
      })
    )
    .query(async ({ ctx, input }) => {
      const { baseCurrency, from, to, interval } = input;

      // from and to should be max 60 intervals apart
      const daysBetween = Math.ceil(
        (to.getTime() - from.getTime()) / (1000 * 60 * 60 * 24)
      );

      const intervalsBetween =
        interval === "month" ? daysBetween / 30 : daysBetween;

      if (intervalsBetween > 60) {
        throw new TError("error.invalidInput");
      }

      if (interval == "day") {
        return await prisma.$queryRaw<
          { sum: number; date: Date }[]
        >`SELECT SUM(IF(currency = ${baseCurrency}, amountWithoutTax, amountWithoutTax * CurrencyExchangeRates.rate)) as sum, date
        FROM Invoice 
        LEFT JOIN CurrencyExchangeRates ON Invoice.currency = CurrencyExchangeRates.fromCurrency AND CurrencyExchangeRates.toCurrency = ${baseCurrency} 
        WHERE userId = ${ctx.userId} AND date >= ${from} AND date <= ${to}
        GROUP BY date`;
      } else {
        const results = await prisma.$queryRaw<
          { sum: number; date: string }[]
        >`SELECT SUM(IF(currency = ${baseCurrency}, amountWithoutTax, amountWithoutTax * CurrencyExchangeRates.rate)) as sum, CONCAT(YEAR(date), '-', MONTH(date)) as date
        FROM Invoice 
        LEFT JOIN CurrencyExchangeRates ON Invoice.currency = CurrencyExchangeRates.fromCurrency AND CurrencyExchangeRates.toCurrency = ${baseCurrency} 
        WHERE userId = ${ctx.userId} AND date >= ${from} AND date <= ${to}
        GROUP BY CONCAT(YEAR(date), '-', MONTH(date))`;

        return results.map((r) => {
          const [year, month] = r.date.split("-");
          return {
            sum: r.sum,
            date: new Date(parseInt(year), parseInt(month) - 1),
          };
        });
      }
    }),
});
