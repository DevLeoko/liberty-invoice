<script lang="ts">
	import GettingStartedSection from '../../../lib/components/getting-started/GettingStartedSection.svelte'

	const gettingStatedHidden = localStorage.getItem('gettingStartedHidden') == 'true'
</script>

<h1 class="pageTitle">Dashboard</h1>

{#if !gettingStatedHidden}
	<GettingStartedSection />

	<hr class="my-4" />
{/if}
