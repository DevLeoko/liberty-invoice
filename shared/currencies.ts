const USD = {
  shorthand: "USD",
  symbol: "$",
  symbolOnLeft: true,
};

export const CURRENCIES = [
  {
    shorthand: "EUR",
    symbol: "€",
    symbolOnLeft: false,
  },
  USD,
  {
    shorthand: "PLN",
    symbol: "zł",
    symbolOnLeft: false,
  },
  {
    shorthand: "JPY",
    symbol: "¥",
    symbolOnLeft: true,
  },
  {
    shorthand: "GBP",
    symbol: "£",
    symbolOnLeft: true,
  },
  {
    shorthand: "AUD",
    symbol: "A$",
    symbolOnLeft: true,
  },
  {
    shorthand: "CAD",
    symbol: "C$",
    symbolOnLeft: true,
  },
  {
    shorthand: "CHF",
    symbol: "CHF",
    symbolOnLeft: true,
  },
  {
    shorthand: "CNY",
    symbol: "¥",
    symbolOnLeft: true,
  },
  {
    shorthand: "SEK",
    symbol: "kr",
    symbolOnLeft: false,
  },
  {
    shorthand: "NZD",
    symbol: "NZ$",
    symbolOnLeft: true,
  },
  {
    shorthand: "MXN",
    symbol: "MX$",
    symbolOnLeft: true,
  },
  {
    shorthand: "SGD",
    symbol: "S$",
    symbolOnLeft: true,
  },
  {
    shorthand: "HKD",
    symbol: "HK$",
    symbolOnLeft: true,
  },
  {
    shorthand: "NOK",
    symbol: "kr",
    symbolOnLeft: false,
  },
  {
    shorthand: "KRW",
    symbol: "₩",
    symbolOnLeft: true,
  },
  {
    shorthand: "TRY",
    symbol: "₺",
    symbolOnLeft: true,
  },
  {
    shorthand: "RUB",
    symbol: "₽",
    symbolOnLeft: true,
  },
  {
    shorthand: "INR",
    symbol: "₹",
    symbolOnLeft: true,
  },
  {
    shorthand: "BRL",
    symbol: "R$",
    symbolOnLeft: true,
  },
  {
    shorthand: "ZAR",
    symbol: "R",
    symbolOnLeft: true,
  },
];

export function getCurrency(shorthand: string, langCode: string) {
  const currency =
    CURRENCIES.find((currency) => currency.shorthand === shorthand) || USD;
  return {
    ...currency,
    format: (value: number) => formatCurrencyGeneric(value, currency, langCode),
  };
}

// export const currency = writable(CURRENCIES[0])

export interface Currency {
  shorthand: string;
  symbol: string;
  symbolOnLeft: boolean;
}

export function formatCurrencyGeneric(
  value: number,
  currency: Currency,
  langCode: string
) {
  const formatted = value.toLocaleString(langCode, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
  if (currency.symbolOnLeft) {
    return `${currency.symbol}${formatted}`;
  }
  return `${formatted}${currency.symbol}`;
}
