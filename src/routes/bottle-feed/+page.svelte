<script lang="ts">
	import { base } from '$app/paths';
	import AmountInput from '$lib/components/AmountInput.svelte';
	import SubmitFeedback from '$lib/components/SubmitFeedback.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import { submitLog } from '$lib/services/api';
	import { userStore } from '$lib/stores/user.svelte';

	type SubmitState = 'idle' | 'loading' | 'success' | 'error';

	let amountBefore = $state(0);
	let amountAfter = $state(0);
	let elapsedSeconds = $state(0);
	let timerRunning = $state(false);
	let submitState = $state<SubmitState>('idle');
	let errorMessage = $state('');

	const canSave = $derived(
		amountBefore > 0 && elapsedSeconds > 0 && !timerRunning && submitState === 'idle'
	);

	async function save(): Promise<void> {
		if (!canSave) return;

		submitState = 'loading';
		const result = await submitLog({
			user: userStore.current,
			type: 'bottle',
			duration: elapsedSeconds,
			amount_before: amountBefore,
			amount_after: amountAfter,
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
		<h2 class="text-2xl font-bold text-ink">🍼 Bottle Feed</h2>
	</div>

	{#if submitState !== 'idle'}
		<div class="flex flex-1 items-center justify-center">
			<SubmitFeedback state={submitState} message={errorMessage} onretry={retry} />
		</div>
	{:else}
		<!-- Amount before -->
		<section>
			<AmountInput bind:value={amountBefore} label="Amount in bottle" />
		</section>

		<!-- Timer -->
		<section class="flex flex-col items-center py-4">
			<Timer bind:elapsedSeconds bind:running={timerRunning} />
		</section>

		<!-- Amount after -->
		<section>
			<AmountInput bind:value={amountAfter} label="Amount remaining" />
		</section>

		<!-- Save -->
		<div class="mt-auto">
			{#if amountBefore === 0}
				<p class="mb-3 text-center text-sm text-ink-subtle">Enter the amount in the bottle to get started.</p>
			{:else if timerRunning}
				<p class="mb-3 text-center text-sm text-ink-subtle">Stop the timer when the feed is finished.</p>
			{:else if elapsedSeconds === 0}
				<p class="mb-3 text-center text-sm text-ink-subtle">Start the timer when the feed begins.</p>
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
