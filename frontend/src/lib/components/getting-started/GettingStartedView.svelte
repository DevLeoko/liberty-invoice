<script lang="ts">
	import { createEventDispatcher, type ComponentType, type SvelteComponentTyped } from 'svelte'
	import Button from '../basics/Button.svelte'
	import ProgressDots from '../basics/ProgressDots.svelte'
	import AddressStep from './AddressStep.svelte'
	import AllDoneStep from './AllDoneStep.svelte'
	import CompanyNameStep from './CompanyNameStep.svelte'
	import DefaultsStep from './DefaultsStep.svelte'
	import GettingStartedStep from './GettingStartedStep.svelte'
	import VatStep from './VatStep.svelte'

	const dispatchEvent = createEventDispatcher<{ close: void }>()

	const STEP_COMPONENTS: ComponentType<SvelteComponentTyped<{ saveStep?: () => Promise<void> }>>[] =
		[GettingStartedStep, CompanyNameStep, AddressStep, VatStep, DefaultsStep, AllDoneStep]

	let activeStepComp: any

	let step = 0
	let loadingNext = false

	async function nextStep() {
		if (step < STEP_COMPONENTS.length - 1) {
			if (activeStepComp?.saveStep) {
				loadingNext = true
				await activeStepComp.saveStep().finally(() => (loadingNext = false))
			}

			step++
		} else {
			dispatchEvent('close')
		}
	}

	function previousStep() {
		if (step > 0) {
			step--
		} else {
			dispatchEvent('close')
		}
	}
</script>

<div class="flex flex-col items-center w-[32rem] p-6 rounded-md getting-started">
	<svelte:component this={STEP_COMPONENTS[step]} bind:this={activeStepComp} />

	<ProgressDots totalSteps={STEP_COMPONENTS.length} {step} class="mt-12" />

	<div class="flex justify-between w-full mt-4">
		<Button gray outlined on:click={previousStep}>
			{#if step == 0}
				Close
			{:else}
				<span class="mr-1 text-sm material-icons">arrow_back</span>
				Back
			{/if}
		</Button>

		<Button loading={loadingNext} on:click={nextStep}>
			{step == 0
				? 'Get started'
				: step == STEP_COMPONENTS.length - 1
				? 'Finish'
				: 'Save and continue'}
		</Button>
	</div>
</div>

<style>
	.getting-started {
		background: linear-gradient(-20deg, #ffffff 0%, #e2f0ff 100%);
	}
</style>
