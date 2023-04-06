<script lang="ts">
	import { goto } from '$app/navigation';
	import Button from '../../lib/components/basics/Button.svelte';
	import { setLoggedOut } from '../../lib/stores/auth';

	function logout() {
		setLoggedOut();
		goto('/');
	}
</script>

<slot />

<Button on:click={logout} class="mt-2">Logout</Button>
