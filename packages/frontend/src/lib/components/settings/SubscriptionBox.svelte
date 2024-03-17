<script lang="ts">
	import Button from '$lib/components/basics/Button.svelte'
	import Chip from '$lib/components/basics/Chip.svelte'
	import Skeleton from '$lib/components/basics/Skeleton.svelte'
	import VerticalSelector from '$lib/components/basics/VerticalSelector.svelte'
	import { authData, updateAuthData } from '$lib/stores/auth'
	import { applicationLanguage, isInstalledFromStore, logInfo, t } from '$lib/stores/settings'
	import { Locale } from '$lib/translations/translations'
	import { trpc, type SubscriptionStatus } from '$lib/trpcClient'
	import { Plan } from 'shared/plans'

	let billingCycle: 'monthly' | 'yearly' = 'monthly'

	let status: SubscriptionStatus | null = null

	trpc.planSubscription.readSubscriptionStatus.query().then((data) => {
		status = data

		if ($authData && status.activePlan != $authData.plan) {
			updateAuthData({
				...$authData,
				plan: status.activePlan as Plan,
			})

			if (status.activePlan) {
				$logInfo('subscription.successfulUpgrade', undefined, 5000)
			}
		}
	})

	let loadingUpgrade = false
	async function onUpgrade() {
		loadingUpgrade = true

		const { url } = await (
			status?.stripeCustomerId
				? trpc.planSubscription.getCustomerPortalUrl.query()
				: trpc.planSubscription.getCheckoutSessionUrl.query({
						billingCycle,
						plan: Plan.PLUS,
						currency: $applicationLanguage == Locale.DE ? 'eur' : 'usd',
					})
		).finally(() => {
			loadingUpgrade = false
		})

		if (!url) return

		window.location = url as any
	}

	let loadingOpenPortal = false
	async function openPortal() {
		loadingOpenPortal = true
		const { url } = await trpc.planSubscription.getCustomerPortalUrl.query().finally(() => {
			loadingOpenPortal = false
		})

		if (!url) return

		window.location = url as any
	}
</script>

<!-- TODO: disable subscription ability on Play/AppStore PWA version -->
{#if status}
	<div class="flex flex-col gap-2 px-3 py-2 mt-2 bg-gray-150">
		<b>
			{$t('subscription.activePlan')}
			<Chip color={status.activePlan ? 'blue-500' : 'gray-700'} class="inline-block">
				{status.activePlan || 'Free'}
			</Chip>
		</b>

		{#if !status.activePlan}
			{#if $isInstalledFromStore}
				<div>
					<ul class="pl-8 list-disc">
						<li>{$t('subscription.freeFeatures.feature1')}</li>
						<li>{$t('subscription.freeFeatures.feature2')}</li>
						<li>{$t('subscription.freeFeatures.feature3')}</li>
						<li>{$t('subscription.freeFeatures.feature4')}</li>
						<li>{$t('subscription.freeFeatures.feature5')}</li>
						<li>{$t('subscription.freeFeatures.feature6')}</li>
					</ul>

					<ul class="pl-8 text-gray-500 list-disc marker:text-gray-300">
						<li>{$t('subscription.plusFeatures.feature1')}</li>
						<li>{$t('subscription.plusFeatures.feature2')}</li>
						<li>{$t('subscription.plusFeatures.feature3')}</li>
						<li>{$t('subscription.plusFeatures.feature4')}</li>
						<li>{$t('subscription.plusFeatures.feature5')}</li>
					</ul>
				</div>

				<div class="[&>a]:text-blue-500 [&>a]:font-medium">
					{@html $t('subscription.subscriptionNoteForApp')}
				</div>
			{:else}
				<h2 class="mt-2 text-base">
					{$t('subscription.upgradeToUnlockP1')}
					<Chip color="blue-500" class="inline-block">Plus</Chip>
					{$t('subscription.upgradeToUnlockP2')}
				</h2>
				<ul class="pl-8 list-disc">
					<li>{$t('subscription.plusFeatures.feature1')}</li>
					<li>{$t('subscription.plusFeatures.feature2')}</li>
					<li>{$t('subscription.plusFeatures.feature3')}</li>
					<li>{$t('subscription.plusFeatures.feature4')}</li>
					<li>{$t('subscription.plusFeatures.feature5')}</li>
				</ul>

				<div class="">
					{$t('subscription.just')}
					<span class="text-xl">
						{billingCycle === 'yearly'
							? $t('subscription.plusPriceYearly')
							: $t('subscription.plusPriceMonthly')}
					</span>
					<span class="text-sm">
						/
						{billingCycle === 'yearly' ? $t('subscription.year') : $t('subscription.month')}
						<i class="text-gray-500">
							({$t('subscription.plusTax')})
						</i>
					</span>
				</div>

				<div class="flex items-center gap-1">
					{$t('subscription.whenBilled')}
					<VerticalSelector
						bind:value={billingCycle}
						options={[
							{
								value: 'monthly',
								label: $t('subscription.monthly'),
							},
							{
								value: 'yearly',
								label: $t('subscription.yearly'),
							},
						]}
					/>
				</div>

				<Button class="mt-2" loading={loadingUpgrade} on:click={onUpgrade} snug>
					{$t('subscription.upgradeToPlus')}
				</Button>
			{/if}
		{:else if !$isInstalledFromStore}
			<Button class="mt-2" loading={loadingOpenPortal} on:click={openPortal} snug>
				{$t('subscription.manageSubscription')}
			</Button>
		{/if}
	</div>
{:else}
	<Skeleton class="w-full h-20" />
{/if}
