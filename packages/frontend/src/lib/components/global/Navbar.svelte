<script lang="ts">
	import { goto } from '$app/navigation'
	import { page } from '$app/stores'
	import Chip from '$lib/components/basics/Chip.svelte'
	import Skeleton from '$lib/components/basics/Skeleton.svelte'
	import SupportModal from '$lib/components/global/SupportModal.svelte'
	import { createUserSettingsQuery } from '$lib/controller/user-settings'
	import { formatClientName } from 'shared/client-formatter'
	import { authData, setLoggedOut } from '../../stores/auth'
	import { applicationLanguage, t } from '../../stores/settings'
	import LanguageSelector from '../LanguageSelector.svelte'
	import Button from '../basics/Button.svelte'
	import FloatingCardTrigger from '../basics/FloatingCardTrigger.svelte'
	import MobileNavbar from './MobileNavbar.svelte'

	function logout() {
		setLoggedOut()
		goto('/')
	}

	const userSettings = createUserSettingsQuery()

	const PAGES = [
		{
			name: 'menu.dashboard',
			icon: 'dashboard',
			href: '/dashboard',
			primary: true,
		},
		{
			name: 'menu.invoices',
			icon: 'receipt',
			href: '/invoices',
			primary: true,
		},
		{
			name: 'menu.clients',
			icon: 'people',
			href: '/clients',
			primary: true,
		},
		{
			name: 'menu.products',
			icon: 'inventory_2',
			href: '/products',
			primary: true,
		},
		{
			name: 'menu.settings',
			icon: 'settings',
			href: '/settings',
			primary: false,
		},
	] as const

	let showMenu = false

	let showSupportModal = false

	$: accountName = $userSettings.data ? formatClientName($userSettings.data, true) : ''
</script>

{#if showSupportModal}
	<SupportModal on:exit={() => (showSupportModal = false)} />
{/if}

<div class="hidden md:flex h-[100dvh] w-60 min-w-60" />
<div
	class="hidden md:flex md:fixed flex-col bg-white h-[100dvh] w-full px-4 pt-8 md:border-r md:w-60 {showMenu
		? '!flex fixed top-0 left-0 w-screen h-screen z-30'
		: ''}"
	on:click={() => (showMenu = false)}
>
	<!-- <img src="" alt="logo" class="self-center w-2/3" /> -->
	<a class="flex items-center justify-center md:justify-start" href="/">
		<img class="h-8 mx-auto" src="/logo.svg" alt="logo" />
	</a>

	<nav class="flex flex-col mt-6">
		{#each PAGES as link (link.href)}
			{@const active = $page.url.pathname.startsWith(link.href)}
			<a
				href={link.href}
				class="flex items-center px-2 py-1 my-2 rounded-sm hover:bg-slate-100"
				class:bg-slate-100={active}
				class:text-slate-700={!active}
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
	<Button on:click={() => (showSupportModal = !showSupportModal)} text class="mt-auto">
		<div class="flex items-center gap-1">
			<class class="text-xl material-icons">support</class>
			<span>{$t('menu.needHelp')}</span>
		</div>
	</Button>

	{#if $userSettings.data}
		<a
			class="p-2 mt-2 text-sm border rounded-md border-gray-150 bg-gray-50 hover:border-blue-300 hover:bg-blue-50"
			href="/settings/account"
		>
			<div class="flex items-start justify-between">
				<div class="flex flex-col">
					<b class="text-medium">
						{accountName || $authData?.accountMail}
					</b>
					{#if accountName}
						<span class="-mt-0.5 text-xs text-gray-500">
							{$authData?.accountMail}
						</span>
					{/if}
				</div>
				<Chip color={$authData?.plan ? 'blue-500' : 'gray-700'}>
					{$authData?.plan || 'Free'}
				</Chip>
			</div>
		</a>
	{:else}
		<Skeleton class="w-full h-12 mt-4" />
	{/if}

	<Button on:click={logout} gray class="mt-4">{$t('menu.logout')}</Button>
	<Button class="mt-4 mb-4 md:hidden" outlined gray>{$t('general.close')}</Button>
	<div
		class="flex justify-between mt-1 mb-8 text-xs text-gray-700 md:mb-4"
		on:click|stopPropagation
	>
		<span>&copy; Liberty Invoice {new Date().getFullYear()}</span>

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

<MobileNavbar pages={PAGES.filter((p) => p.primary)} bind:showMenu />
