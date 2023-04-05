import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { createTRPCProxyClient, httpBatchLink, loggerLink, type TRPCLink } from '@trpc/client';
import SuperJSON from 'superjson';
import type { AppRouter, RouterInput, RouterOutput } from '../../../backend/src/routers/_app';
import { logError } from './stores/alerts';

export const trpc = createTRPCProxyClient<AppRouter>({
	transformer: SuperJSON,
	links: [
		loggerLink({
			logger: (data) => {
				if (data.direction == 'down') {
					if (data.result instanceof Error) {
						logError(data.result.message);
					}
				}
			}
		}),
		httpBatchLink({
			url: PUBLIC_BACKEND_URL + '/trpc'
		})
	]
});

export function nonTrpcFetch(path: string, options?: RequestInit) {
	return fetch(PUBLIC_BACKEND_URL + '/' + path, options).then(async (res) => {
		if (!res.ok) {
			// Is json?
			if (res.headers.get('content-type')?.startsWith('application/json')) {
				throw new Error((await res.json())?.message ?? res.statusText);
			} else {
				throw new Error(await res.text());
			}
		}

		return res;
	});
}
