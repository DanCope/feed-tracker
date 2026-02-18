<script lang="ts">
	import { base } from '$app/paths';
	import ScaleSelector from '$lib/components/ScaleSelector.svelte';
	import SubmitFeedback from '$lib/components/SubmitFeedback.svelte';
	import { userStore } from '$lib/stores/user.svelte';
	import { submitLog } from '$lib/services/api';
	import type { Scale } from '$lib/services/api';

	type SubmitState = 'idle' | 'loading' | 'success' | 'error';

	let poop = $state<Scale>('None');
	let pee = $state<Scale>('None');
	let submitState = $state<SubmitState>('idle');
	let errorMessage = $state('');

	async function save(): Promise<void> {
		if (submitState !== 'idle') return;

		submitState = 'loading';
		const result = await submitLog({
			user: userStore.current,
			type: 'nappy',
			poop,
			pee,
		});

		if (result.success) {
			submitState = 'success';
		} else {
			submitState = 'error';
			errorMessage = result.message;
		}
	}

	function retry(): void {
		submitState = 'idle';
		save();
	}
</script>

<div class="flex flex-1 flex-col gap-6 p-6">
	<div class="flex items-center gap-3">
		<a href="{base}/" class="text-sm text-violet-600 hover:underline" aria-label="Back to home">← Back</a>
		<h2 class="text-2xl font-bold text-amber-700">🧷 Nappy Change</h2>
	</div>

	{#if submitState !== 'idle'}
		<div class="flex flex-1 items-center justify-center">
			<SubmitFeedback state={submitState} message={errorMessage} onretry={retry} />
		</div>
	{:else}
		<section>
			<ScaleSelector bind:value={poop} label="Poop" variant="poop" />
		</section>

		<section>
			<ScaleSelector bind:value={pee} label="Pee" variant="pee" />
		</section>

		<div class="mt-auto">
			<button
				type="button"
				onclick={save}
				class="w-full rounded-2xl bg-violet-600 py-4 text-xl font-bold text-white shadow-sm transition-colors hover:bg-violet-700 active:bg-violet-800"
			>
				Save
			</button>
		</div>
	{/if}
</div>
