import { PUBLIC_BACKEND_URL } from '$env/static/public';
import { createTRPCProxyClient, httpBatchLink, loggerLink, type TRPCLink } from '@trpc/client';
import SuperJSON from 'superjson';
import type { AppRouter, RouterInput, RouterOutput } from '../../../backend/src/routers/_app';
import { logError } from './stores/alerts';
import { setLoggedOut } from './stores/auth';
import { goto } from '$app/navigation';

export type CreateClient = RouterInput['client']['create'];

export type ReadUserSettings = RouterOutput['userSettings']['read'];

export const trpc = createTRPCProxyClient<AppRouter>({
	transformer: SuperJSON,
	links: [
		loggerLink({
			logger: (data) => {
				if (data.direction == 'down') {
					if (data.result instanceof Error) {
						if (data.result.message == 'error.notAuthenticated') {
							logError('error.sessionExpired');
							setLoggedOut();
							goto('/');
						} else {
							logError(data.result.message);
						}
					}
				}
			}
		}),
		httpBatchLink({
			url: PUBLIC_BACKEND_URL + '/trpc',
			fetch(url, options) {
				return fetch(url, {
					...options,
					credentials: 'include'
				});
			}
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
