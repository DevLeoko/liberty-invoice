<script lang="ts">
	import { page } from '$app/stores';
	import { setLoggedOut } from '../../lib/stores/auth';
	import { goto } from '$app/navigation';
	import Button from '../../lib/components/basics/Button.svelte';

	function logout() {
		setLoggedOut();
		goto('/');
	}

	// Uses google material icons
	const PAGES = [
		{
			name: 'Dashboard',
			icon: 'dashboard',
			href: '/dashboard'
		},
		{
			name: 'Invoices',
			icon: 'receipt',
			href: '/invoices'
		},
		{
			name: 'Clients',
			icon: 'people',
			href: '/clients'
		},
		{
			name: 'Products',
			icon: 'inventory_2',
			href: '/products'
		},
		{
			name: 'Settings',
			icon: 'settings',
			href: '/settings'
		}
	];
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
						{link.name}
					</span>
				</a>
			{/each}
		</nav>
		<Button on:click={logout} outlined class="mt-auto mb-4">Logout</Button>
	</div>
	<div class="flex-grow p-8">
		<slot />
	</div>
</div>
