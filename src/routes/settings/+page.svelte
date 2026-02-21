<script lang="ts">
	import { base } from '$app/paths';
	import { configStore } from '$lib/stores/config.svelte';
	import { themeStore, type ThemePreference } from '$lib/stores/theme.svelte';

	const themeOptions: { value: ThemePreference; label: string; icon: string }[] = [
		{ value: 'system', label: 'System', icon: '💻' },
		{ value: 'light',  label: 'Light',  icon: '☀️' },
		{ value: 'dark',   label: 'Dark',   icon: '🌙' },
	];

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
		<h2 class="text-xl font-bold text-ink">Settings</h2>
		<p class="mt-1 text-sm text-ink-subtle">
			Configure the Google Apps Script backend. These values are stored only on this device.
		</p>
	</div>

	<!-- Theme toggle -->
	<div class="flex flex-col gap-2">
		<p class="text-sm font-semibold text-ink">Appearance</p>
		<div class="flex rounded-xl border border-edge bg-surface-raised p-1" role="group" aria-label="Colour scheme">
			{#each themeOptions as opt}
				<button
					type="button"
					onclick={() => themeStore.set(opt.value)}
					aria-pressed={themeStore.preference === opt.value}
					class="flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-semibold transition-colors"
					class:bg-brand={themeStore.preference === opt.value}
					class:text-white={themeStore.preference === opt.value}
					class:text-ink-subtle={themeStore.preference !== opt.value}
				>
					<span aria-hidden="true">{opt.icon}</span>
					{opt.label}
				</button>
			{/each}
		</div>
	</div>

	<form onsubmit={handleSubmit} class="flex flex-col gap-5">
		<div class="flex flex-col gap-2">
			<label for="deployment-id" class="text-sm font-semibold text-ink">
				Deployment ID
			</label>
			<input
				id="deployment-id"
				type="text"
				bind:value={deploymentId}
				placeholder="AKfycbx…"
				required
				class="w-full rounded-xl border border-edge bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-placeholder focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
			/>
			<p class="text-xs text-ink-subtle">
				Found in Apps Script → Deploy → Manage deployments. You can also paste the full URL.
			</p>
		</div>

		<div class="flex flex-col gap-2">
			<label for="secret" class="text-sm font-semibold text-ink">
				Shared Secret
			</label>
			<input
				id="secret"
				type="text"
				bind:value={secret}
				placeholder="your-shared-secret"
				required
				class="w-full rounded-xl border border-edge bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-placeholder focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
			/>
			<p class="text-xs text-ink-subtle">Must match the secret in your Apps Script.</p>
		</div>

		<button
			type="submit"
			class="flex items-center justify-center gap-2 rounded-xl bg-brand px-6 py-3 font-semibold text-white transition-colors hover:bg-brand-hover active:bg-brand-active"
		>
			{#if saved}
				✅ Saved!
			{:else}
				Save Settings
			{/if}
		</button>
	</form>

	<div class="flex justify-center">
		<a href="{base}/" class="rounded-xl border border-edge bg-surface-raised px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-tint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25">← Back to home</a>
	</div>
</div>
