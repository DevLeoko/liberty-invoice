<script lang="ts">
	import { page } from '$app/stores'
	import { setLoggedOut } from '../../lib/stores/auth'
	import { goto } from '$app/navigation'
	import Button from '../../lib/components/basics/Button.svelte'
	import { applicationLanguage, t } from '../../lib/stores/settings'
	import { Locale } from '../../lib/translations/translations'

	function logout() {
		setLoggedOut()
		goto('/')
	}

	// Uses google material icons
	const PAGES = [
		{
			name: 'menu.dashboard',
			icon: 'dashboard',
			href: '/dashboard',
		},
		{
			name: 'menu.invoices',
			icon: 'receipt',
			href: '/invoices',
		},
		{
			name: 'menu.clients',
			icon: 'people',
			href: '/clients',
		},
		{
			name: 'menu.products',
			icon: 'inventory_2',
			href: '/products',
		},
		{
			name: 'menu.settings',
			icon: 'settings',
			href: '/settings',
		},
	] as const

	function changeLanguage() {
		$applicationLanguage = $applicationLanguage === Locale.DE ? Locale.EN : Locale.DE
	}
</script>

<div class="flex max-w-screen-2xl">
	<div class="flex flex-col w-48 h-screen px-4 pt-8 bg-white">
		<!-- <img src="" alt="logo" class="self-center w-2/3" /> -->
		<h2 class="text-lg font-bold">Liberty Invoice</h2>
		<nav class="flex flex-col mt-6">
			{#each PAGES as link (link.href)}
				{@const active = $page.url.pathname.startsWith(link.href)}
				<a
					href={link.href}
					class="flex items-center px-2 py-1 my-2 rounded-sm hover:bg-slate-100"
					class:bg-slate-200={active}
				>
					<span class="material-icons mr-2 !text-lg relative">
						{link.icon}
					</span>
					<span class="relative font-semibold">
						{$t(link.name)}
					</span>
				</a>
			{/each}
		</nav>
		<Button on:click={logout} outlined class="mt-auto">{$t('menu.logout')}</Button>
		<div class="flex justify-between mt-1 mb-4 text-xs text-gray-700">
			<span>&copy; Liberty Invoice 2023</span>
			<span class="underline cursor-pointer" on:click={changeLanguage}
				>{$applicationLanguage.toUpperCase()}</span
			>
		</div>
	</div>
	<div class="flex-grow p-8">
		<slot />
	</div>
</div>
