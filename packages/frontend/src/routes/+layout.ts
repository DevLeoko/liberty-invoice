import { goto } from '$app/navigation'
import { get } from 'svelte/store'
import { checkLoginState, isLoggedIn } from '../lib/stores/auth'
import type { LayoutLoad } from './$types'

export const ssr = false

export const load: LayoutLoad = async (event) => {
	checkLoginState()
	const authRoute = event.route.id?.startsWith('/auth/')

	if (!get(isLoggedIn)) {
		if (!authRoute) return goto('/auth/login')
	} else {
		const isPasswordResetRoute = event.route.id == '/auth/password'
		const wrongAuthRoute = authRoute && !isPasswordResetRoute
		if (!event.route.id || wrongAuthRoute) return goto('/dashboard')
	}
}
