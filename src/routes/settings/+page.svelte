<script lang="ts">
	import { base } from '$app/paths';
	import { configStore } from '$lib/stores/config.svelte';

	let deploymentId = $state(configStore.deploymentId);
	let secret = $state(configStore.secret);
	let saved = $state(false);

	$effect(() => {
		configStore.init();
		deploymentId = configStore.deploymentId;
		secret = configStore.secret;
	});

	function handleSubmit(e: SubmitEvent): void {
		e.preventDefault();
		configStore.save({ deploymentId, secret });
		saved = true;
		setTimeout(() => { saved = false; }, 2000);
	}
</script>

<svelte:head>
	<title>Settings — Feed Tracker</title>
</svelte:head>

<div class="flex flex-1 flex-col gap-6 p-6">
	<div>
		<h2 class="text-xl font-bold text-gray-900">Settings</h2>
		<p class="mt-1 text-sm text-gray-500">
			Configure the Google Apps Script backend. These values are stored only on this device.
		</p>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-5">
		<div class="flex flex-col gap-1.5">
			<label for="deployment-id" class="text-sm font-semibold text-gray-700">
				Deployment ID
			</label>
			<input
				id="deployment-id"
				type="text"
				bind:value={deploymentId}
				placeholder="AKfycbx…"
				required
				class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
			/>
			<p class="text-xs text-gray-400">
				Found in Apps Script → Deploy → Manage deployments. You can also paste the full URL.
			</p>
		</div>

		<div class="flex flex-col gap-1.5">
			<label for="secret" class="text-sm font-semibold text-gray-700">
				Shared Secret
			</label>
			<input
				id="secret"
				type="text"
				bind:value={secret}
				placeholder="your-shared-secret"
				required
				class="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-200"
			/>
			<p class="text-xs text-gray-400">Must match the secret in your Apps Script.</p>
		</div>

		<button
			type="submit"
			class="flex items-center justify-center gap-2 rounded-xl bg-violet-700 px-6 py-3 font-semibold text-white transition-colors hover:bg-violet-800 active:bg-violet-900"
		>
			{#if saved}
				✅ Saved!
			{:else}
				Save Settings
			{/if}
		</button>
	</form>

	<a href="{base}/" class="text-center text-sm text-violet-600 underline">← Back to home</a>
</div>
