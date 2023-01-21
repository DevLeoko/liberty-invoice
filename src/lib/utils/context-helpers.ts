import { getContext, setContext } from 'svelte'

export function setService<T>(key: string | symbol, service: T): T {
	setContext(key, service)
	return service
}

export function getService<T>(key: string | symbol): () => T {
	return () => getContext(key) as T
}

export function defineContext<T>(key: string | symbol = Symbol()): {
	getContext: () => T
	createContext: (service: T) => T
} {
	return {
		getContext: getService<T>(key),
		createContext: (service: T) => {
			setService(key, service)
			return service
		}
	}
}
