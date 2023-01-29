<script>
	import 'material-icons/iconfont/material-icons.css'
	import '../app.scss'
	import '../app.postcss'

	import { onMount } from 'svelte'
	import { syncAllStores } from '../lib/utils/persistence'

	onMount(async () => {
		return await syncAllStores()
	})
</script>

<slot />
