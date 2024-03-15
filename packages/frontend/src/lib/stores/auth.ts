import type { Plan } from 'shared/plans'
import { persisted } from 'svelte-persisted-store'
import { derived, get } from 'svelte/store'

const loggedInState = persisted<{
	until: number
	authData: { userId: string; plan: Plan | null }
} | null>('loggedInState', null)

export const loggedIn = derived(loggedInState, ($loggedInState) => $loggedInState)

export function checkLoginState() {
	const until = get(loggedInState)?.until

	if (until && new Date(until) < new Date()) {
		loggedInState.set(null)
	}
}

export function setLoggedIn(authData: { userId: string; plan: Plan | null }) {
	loggedInState.set({
		until: new Date().getTime() + 1000 * 60 * 60 * 24 * 7, // 7 days TODO: make this the same as the backend
		authData,
	})
}

// TODO: AuthData/AuthPayload should be a shared type
export function updateAuthData(authData: { userId: string; plan: Plan | null }) {
	const loggedIn = get(loggedInState)

	if (loggedIn) {
		loggedInState.set({
			...loggedIn,
			authData,
		})
	}
}

// TODO: This should also properly handle redirecting to the login page (without inconsistent application state)
export function setLoggedOut() {
	loggedInState.set(null)
}
