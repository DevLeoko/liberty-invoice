import { browser } from '$app/environment'
import { goto } from '$app/navigation'
import { pwaSource } from '$lib/stores/settings'
import { get } from 'svelte/store'
import { checkLoginState, isLoggedIn } from '../lib/stores/auth'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load: LayoutLoad = async (event) => {
	checkLoginState()

	const source = event.url.searchParams.get('source')

	if (source && browser) {
		if (
			source === 'google-play' ||
			source === 'app-store' ||
			source === 'microsoft' ||
			source === 'pwa' ||
			source === 'web'
		) {
			pwaSource.set(source)
		} else {
			console.error('Invalid source', source)
		}
	}

	const authRoute = event.route.id?.startsWith('/auth/')

	if (!get(isLoggedIn)) {
		if (!authRoute) return goto('/auth/login')
	} else {
		const isPasswordResetRoute = event.route.id == '/auth/password'
		const wrongAuthRoute = authRoute && !isPasswordResetRoute
		if (!event.route.id || wrongAuthRoute) return goto('/dashboard')
	}
}
