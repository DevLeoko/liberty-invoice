import { createQuery } from '@tanstack/svelte-query'
import { trpc } from '../trpcClient'

export const STATS_KEYS = {
	all: ['stats'],
	allAggregationStats: () => [...STATS_KEYS.all, 'aggregationStats'],
	aggregationStats: (baseCurrency: string) => [...STATS_KEYS.allAggregationStats(), baseCurrency],
}

export function createAggregationStatsQuery(baseCurrency: string) {
	return createQuery({
		queryKey: STATS_KEYS.aggregationStats(baseCurrency),
		queryFn: () => trpc.stats.aggregations.query({ baseCurrency }),
	})
}
