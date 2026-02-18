<script lang="ts">
	import { base } from '$app/paths';
	import Timer from '$lib/components/Timer.svelte';
	import AmountInput from '$lib/components/AmountInput.svelte';
	import SubmitFeedback from '$lib/components/SubmitFeedback.svelte';
	import { userStore } from '$lib/stores/user.svelte';
	import { submitLog } from '$lib/services/api';

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
		<a href="{base}/" class="text-sm text-violet-600 hover:underline" aria-label="Back to home">← Back</a>
		<h2 class="text-2xl font-bold text-sky-700">🍼 Bottle Feed</h2>
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
				<p class="mb-3 text-center text-sm text-gray-400">Enter the amount in the bottle to get started.</p>
			{:else if timerRunning}
				<p class="mb-3 text-center text-sm text-gray-400">Stop the timer when the feed is finished.</p>
			{:else if elapsedSeconds === 0}
				<p class="mb-3 text-center text-sm text-gray-400">Start the timer when the feed begins.</p>
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
