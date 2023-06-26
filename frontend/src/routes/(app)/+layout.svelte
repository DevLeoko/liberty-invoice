<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import LanguageSelector from '../../lib/components/LanguageSelector.svelte'
	import Button from '../../lib/components/basics/Button.svelte'
	import Chip from '../../lib/components/basics/Chip.svelte'
	import FloatingCardTrigger from '../../lib/components/basics/FloatingCardTrigger.svelte'
	import { setLoggedOut } from '../../lib/stores/auth'
	import { applicationLanguage, t } from '../../lib/stores/settings'

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
</script>

<div class="flex max-w-screen-2xl">
	<div class="flex flex-col h-screen px-4 pt-8 bg-white border-r w-60">
		<!-- <img src="" alt="logo" class="self-center w-2/3" /> -->
		<a class="flex items-center" href="/">
			<img class="h-6" src="/logo.svg" alt="logo" />
			<h2 class="ml-2 font-sans text-lg tracking-widest uppercase text-slate-800">
				Liberty Invoice
				<Chip>Early access</Chip>
			</h2>
		</a>

		<nav class="flex flex-col mt-6">
			{#each PAGES as link (link.href)}
				{@const active = $page.url.pathname.startsWith(link.href)}
				<a
					href={link.href}
					class="flex items-center px-2 py-1 my-2 rounded-sm hover:bg-slate-100"
					class:bg-slate-100={active}
					class:opacity-60={!active}
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

			<FloatingCardTrigger preferTop>
				<svelte:fragment slot="trigger">
					<span class="underline">
						{$applicationLanguage.toUpperCase()}
					</span>
				</svelte:fragment>

				<LanguageSelector bind:selected={$applicationLanguage} />
			</FloatingCardTrigger>
		</div>
	</div>
	<div class="flex-grow p-8">
		<slot />
	</div>
</div>
