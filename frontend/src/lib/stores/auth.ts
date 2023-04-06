import { writable } from 'svelte/store';

export const loggedIn = writable(false);

export function checkLoginState() {
	const loginTime = localStorage.getItem('loggedInUntil');

	if (loginTime && new Date(loginTime) > new Date()) {
		loggedIn.set(true);
	} else {
		loggedIn.set(false);
	}
}

export function setLoggedIn() {
	loggedIn.set(true);
	const loginDuration = 1000 * 60 * 60 * 24 * 7; // 7 days TODO: make this the same as the backend
	localStorage.setItem(
		'loggedInUntil',
		new Date(new Date().getTime() + loginDuration).toISOString()
	);
}

export function setLoggedOut() {
	localStorage.removeItem('loggedInUntil');
	loggedIn.set(false);
}
