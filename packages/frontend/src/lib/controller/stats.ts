import { createQuery } from '@tanstack/svelte-query'
import { trpc } from '../trpcClient'

export const STATS_KEYS = {
	all: ['stats'],
	allAggregationStats: () => [...STATS_KEYS.all, 'aggregationStats'],
	aggregationStats: (baseCurrency: string) => [...STATS_KEYS.allAggregationStats(), baseCurrency],
	revenueStats: (baseCurrency: string, from: Date, to: Date, interval: string) => [
		...STATS_KEYS.all,
		'revenueStats',
		baseCurrency,
		from.toISOString(),
		to.toISOString(),
		interval,
	],
}

export function createAggregationStatsQuery(baseCurrency: string) {
	return createQuery({
		queryKey: STATS_KEYS.aggregationStats(baseCurrency),
		queryFn: () => trpc.stats.aggregations.query({ baseCurrency }),
	})
}

export function createRevenueStatsQuery(data: Parameters<typeof trpc.stats.revenue.query>[0]) {
	return createQuery({
		queryKey: STATS_KEYS.revenueStats(data.baseCurrency, data.from, data.to, data.interval),
		queryFn: () => trpc.stats.revenue.query(data),
	})
}
