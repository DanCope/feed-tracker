<script lang="ts">
	import { base } from '$app/paths';
	import SubmitFeedback from '$lib/components/SubmitFeedback.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import type { Side } from '$lib/services/api';
	import { submitLog } from '$lib/services/api';
	import { userStore } from '$lib/stores/user.svelte';

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
		<a href="{base}/" class="text-sm text-brand hover:underline" aria-label="Back to home">← Back</a>
		<h2 class="text-2xl font-bold text-ink">🤱 Breast Feed</h2>
	</div>

	{#if submitState !== 'idle'}
		<div class="flex flex-1 items-center justify-center">
			<SubmitFeedback state={submitState} message={errorMessage} onretry={retry} />
		</div>
	{:else}
		<!-- Side selector -->
		<section aria-labelledby="side-label">
			<p id="side-label" class="mb-3 text-sm font-semibold uppercase tracking-wider text-ink-subtle">
				Which side?
			</p>
			<div class="flex gap-3" role="group" aria-labelledby="side-label">
				{#each (['Left', 'Right'] as Side[]) as option}
					<button
						type="button"
						onclick={() => (side = option)}
						class="flex-1 rounded-2xl py-5 text-xl font-bold shadow-sm transition-colors"
						class:bg-brand={side === option}
						class:text-white={side === option}
						class:bg-surface-tint={side !== option}
						class:text-brand={side !== option}
						class:ring-2={side === option}
						class:ring-brand={side === option}
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
				<p class="mb-3 text-center text-sm text-ink-subtle">Stop the timer when the feed is finished.</p>
			{:else if elapsedSeconds === 0 && side !== null}
				<p class="mb-3 text-center text-sm text-ink-subtle">Start the timer when the feed begins.</p>
			{:else if side === null}
				<p class="mb-3 text-center text-sm text-ink-subtle">Select a side to get started.</p>
			{/if}
			<button
				type="button"
				onclick={save}
				disabled={!canSave}
				class="w-full rounded-2xl py-4 text-xl font-bold shadow-sm transition-colors"
				class:bg-brand={canSave}
				class:text-white={canSave}
				class:hover:bg-brand-hover={canSave}
				class:active:bg-brand-active={canSave}
				class:bg-surface-tint={!canSave}
				class:text-ink-placeholder={!canSave}
				class:cursor-not-allowed={!canSave}
			>
				Save
			</button>
		</div>
	{/if}
</div>
