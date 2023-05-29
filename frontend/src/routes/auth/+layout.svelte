<script lang="ts">
	import { PUBLIC_IS_DEMO } from '$env/static/public'
</script>

<div class="flex w-screen h-screen overflow-hidden">
	<div class="flex-grow p-12">
		<div class="max-w-sm">
			{#if PUBLIC_IS_DEMO}
				<div class="mb-4 text-sm text-gray-500">
					<span class="mr-1 text-xs material-icons">warning</span>
					<span>This is a demo. Data may be reset at any time.</span>
				</div>

				<!-- Demo access account: -->
				<div class="p-2 mb-4 text-sm text-gray-500 shadow bg-gray-50">
					<p>
						<span class="mr-1 text-xs material-icons">lock</span> You can create your own account or
						use this shared demo account: <br />
						E-Mail: lorem@ipsum.com <br />
						Password: lorem
					</p>
				</div>
			{/if}

			<slot />
		</div>
	</div>
	<div class="w-1/3 p-8 -mr-12 -skew-x-6 bg-blue-400 bg-center bg-cover" />
</div>
