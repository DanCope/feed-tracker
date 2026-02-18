<script lang="ts">
	import { base } from '$app/paths';
	import Timer from '$lib/components/Timer.svelte';
	import SubmitFeedback from '$lib/components/SubmitFeedback.svelte';
	import { userStore } from '$lib/stores/user.svelte';
	import { submitLog } from '$lib/services/api';
	import type { Side } from '$lib/services/api';

	type SubmitState = 'idle' | 'loading' | 'success' | 'error';

	let side = $state<Side | null>(null);
	let elapsedSeconds = $state(0);
	let timerRunning = $state(false);
	let submitState = $state<SubmitState>('idle');
	let errorMessage = $state('');

	const canSave = $derived(
		side !== null && elapsedSeconds > 0 && !timerRunning && submitState === 'idle'
	);

	async function save(): Promise<void> {
		if (!canSave || side === null) return;

		submitState = 'loading';
		const result = await submitLog({
			user: userStore.current,
			type: 'breast',
			side,
			duration: elapsedSeconds,
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
		<h2 class="text-2xl font-bold text-rose-700">🤱 Breast Feed</h2>
	</div>

	{#if submitState !== 'idle'}
		<div class="flex flex-1 items-center justify-center">
			<SubmitFeedback state={submitState} message={errorMessage} onretry={retry} />
		</div>
	{:else}
		<!-- Side selector -->
		<section aria-labelledby="side-label">
			<p id="side-label" class="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
				Which side?
			</p>
			<div class="flex gap-3" role="group" aria-labelledby="side-label">
				{#each (['Left', 'Right'] as Side[]) as option}
					<button
						type="button"
						onclick={() => (side = option)}
						class="flex-1 rounded-2xl py-5 text-xl font-bold shadow-sm transition-colors"
						class:bg-rose-600={side === option}
						class:text-white={side === option}
						class:bg-rose-50={side !== option}
						class:text-rose-700={side !== option}
						class:ring-2={side === option}
						class:ring-rose-600={side === option}
						aria-pressed={side === option}
					>
						{option}
					</button>
				{/each}
			</div>
		</section>

		<!-- Timer -->
		<section class="flex flex-col items-center py-4">
			<Timer bind:elapsedSeconds bind:running={timerRunning} />
		</section>

		<!-- Save -->
		<div class="mt-auto">
			{#if timerRunning}
				<p class="mb-3 text-center text-sm text-gray-400">Stop the timer when the feed is finished.</p>
			{:else if elapsedSeconds === 0 && side !== null}
				<p class="mb-3 text-center text-sm text-gray-400">Start the timer when the feed begins.</p>
			{:else if side === null}
				<p class="mb-3 text-center text-sm text-gray-400">Select a side to get started.</p>
			{/if}
			<button
				type="button"
				onclick={save}
				disabled={!canSave}
				class="w-full rounded-2xl py-4 text-xl font-bold shadow-sm transition-colors"
				class:bg-violet-600={canSave}
				class:text-white={canSave}
				class:hover:bg-violet-700={canSave}
				class:active:bg-violet-800={canSave}
				class:bg-gray-100={!canSave}
				class:text-gray-400={!canSave}
				class:cursor-not-allowed={!canSave}
			>
				Save
			</button>
		</div>
	{/if}
</div>
