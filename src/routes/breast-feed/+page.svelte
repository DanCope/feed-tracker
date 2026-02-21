<script lang="ts">
	import { base } from '$app/paths';
	import SubmitFeedback from '$lib/components/SubmitFeedback.svelte';
	import Timer from '$lib/components/Timer.svelte';
	import type { Side } from '$lib/services/api';
	import { submitLog } from '$lib/services/api';
	import { latestStore } from '$lib/stores/latest.svelte';
	import { userStore } from '$lib/stores/user.svelte';
	import { relativeTime } from '$lib/utils/time';

	type SubmitState = 'idle' | 'loading' | 'success' | 'error';

	let side = $state<Side | null>(null);
	let elapsedSeconds = $state(0);
	let timerRunning = $state(false);
	let submitState = $state<SubmitState>('idle');
	let errorMessage = $state('');
	let showNotes = $state(false);
	let notes = $state('');
	let showTimestamp = $state(false);
	let customTimestamp = $state('');
	let now = $state(Date.now());

	$effect(() => {
		latestStore.refresh();
		const interval = setInterval(() => { now = Date.now(); }, 60_000);
		return () => clearInterval(interval);
	});

	const lastBreast = $derived(latestStore.lastBreastFeed);

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
			notes: notes.trim() || undefined,
			timestamp: showTimestamp && customTimestamp ? new Date(customTimestamp).toISOString() : undefined,
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
		<a href="{base}/" class="rounded-xl border border-edge bg-surface-raised px-3 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-tint focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25" aria-label="Back to home">← Back</a>
		<h2 class="text-2xl font-bold text-ink">🤱 Breast Feed</h2>
	</div>

	{#if submitState !== 'idle'}
		<div class="flex flex-1 items-center justify-center">
			<SubmitFeedback state={submitState} message={errorMessage} onretry={retry} />
		</div>
	{:else}
		<!-- Timestamp override -->
		<div>
			{#if showTimestamp}
				<input
					type="datetime-local"
					bind:value={customTimestamp}
					class="w-full rounded-xl border border-edge bg-surface-raised px-4 py-3 text-sm text-ink focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
				/>
				<button type="button" onclick={() => { showTimestamp = false; customTimestamp = ''; }} class="mt-2 text-sm text-ink-subtle hover:text-ink">Use current time instead</button>
			{:else}
				<button
					type="button"
					onclick={() => {
						customTimestamp = new Date(Date.now() - new Date().getTimezoneOffset() * 60_000).toISOString().slice(0, 16);
						showTimestamp = true;
					}}
					class="text-sm text-ink-subtle hover:text-ink"
				>
					🕐 Change time
				</button>
			{/if}
		</div>

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
						class="relative flex-1 rounded-2xl py-5 text-xl font-bold shadow-sm transition-colors"
						class:bg-brand={side === option}
						class:text-white={side === option}
						class:bg-surface-tint={side !== option}
						class:text-brand={side !== option}
						class:ring-2={side === option}
						class:ring-brand={side === option}
						aria-pressed={side === option}
					>
						{option}
						{#if lastBreast?.side === option}
							<span class="absolute right-2 top-2 rounded-full bg-brand-subtle px-2 py-0.5 text-xs font-semibold text-brand">Last</span>
						{/if}
					</button>
				{/each}
			</div>
			{#if lastBreast}
				<p class="mt-2 text-sm text-ink-subtle">Last: {lastBreast.side} side · {relativeTime(lastBreast.timestamp, now)} · {lastBreast.user}</p>
			{/if}
		</section>

		<!-- Timer -->
		<section class="flex flex-col items-center py-4">
			<Timer bind:elapsedSeconds bind:running={timerRunning} />
		</section>

		<!-- Notes -->
		<div class="flex flex-col gap-2">
			{#if showNotes}
				<textarea
					bind:value={notes}
					rows="3"
					maxlength="500"
					placeholder="Add a note (optional)…"
					class="w-full resize-none rounded-xl border border-edge bg-surface-raised px-4 py-3 text-sm text-ink placeholder:text-ink-placeholder focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
				></textarea>
				<button type="button" onclick={() => (showNotes = false)} class="text-left text-sm text-ink-subtle hover:text-ink">Hide notes</button>
			{:else}
				<button type="button" onclick={() => (showNotes = true)} class="text-left text-sm text-ink-subtle hover:text-ink">
					{#if notes.trim()}
						📝 Note: {notes}
					{:else}
						📝 Add a note
					{/if}
				</button>
			{/if}
		</div>

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
