import { prisma } from '../prisma'

const RATES_USD_TO_CURRENCY: Record<string, number> = {
	EUR: 0.918985,
	USD: 1,
	PLN: 4.085425,
	JPY: 144.652626,
	GBP: 0.792501,
	AUD: 1.509983,
	CAD: 1.325272,
	CHF: 0.898728,
	CNY: 7.254262,
	SEK: 10.858198,
	NZD: 1.646416,
	MXN: 17.114456,
	SGD: 1.355036,
	HKD: 7.837524,
	NOK: 10.799742,
	KRW: 1317.997732,
	TRY: 26.049513,
	RUB: 87.066493,
	INR: 82.091448,
	BRL: 4.851955,
	ZAR: 18.756882,
}

export async function setupCurrencies() {
	const baseEntry = await prisma.currencyExchangeRates.findMany({
		where: { fromCurrency: 'USD', toCurrency: 'USD' },
	})

	if (!baseEntry.length) {
		const currencies = Object.keys(RATES_USD_TO_CURRENCY)

		for (const fromCurrency of currencies) {
			for (const toCurrency of currencies) {
				const rate =
					toCurrency == fromCurrency
						? 1
						: RATES_USD_TO_CURRENCY[toCurrency] / RATES_USD_TO_CURRENCY[fromCurrency]

				await prisma.currencyExchangeRates.upsert({
					where: { toCurrency_fromCurrency: { fromCurrency, toCurrency } },
					update: { rate: rate },
					create: { fromCurrency: fromCurrency, toCurrency: toCurrency, rate: rate },
				})
			}
		}
	}
}
