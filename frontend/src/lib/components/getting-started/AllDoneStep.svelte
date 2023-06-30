<script lang="ts">
	import { t } from '../../stores/settings'

	export async function saveStep() {}

	// allDone: {
	// 	title: 'All done!',
	// 	text: "You're all set up! You can now create your first invoice.",
	// 	cta1: "Make sure to join our",
	// 	cta2: 'Discord server',
	// 	cta3: 'to get the latest updates and to give feedback.',
	// }
</script>

<span class="text-3xl text-lime-500 material-icons-outlined"> done_outline </span>

<h2 class="my-2 text-xl font-semibold">{$t('gettingStarted.allDone.title')}</h2>
<p class="text-center">
	{$t('gettingStarted.allDone.text')}
	<br />
	<br />
	{$t('gettingStarted.allDone.cta1')}
	<a href="https://discord.gg/3Z4fHmr" target="_blank" class="text-blue-500">
		{$t('gettingStarted.allDone.cta2')}
	</a>
	{$t('gettingStarted.allDone.cta3')}
</p>
