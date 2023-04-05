import type { LayoutLoad } from './$types';
import { goto } from '$app/navigation';
import { loggedIn } from '../lib/stores/auth';
import { get } from 'svelte/store';

export const ssr = false;

export const load: LayoutLoad = async (event) => {
	const authRoute = event.route.id?.startsWith('/auth/');

	if (!get(loggedIn)) {
		if (!authRoute) return goto('/auth/login');
	} else {
		if (!event.route.id) return goto('/dashboard');
	}
};
