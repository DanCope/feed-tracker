<script lang="ts">
	import { base } from '$app/paths';
	import ScaleSelector from '$lib/components/ScaleSelector.svelte';
	import SubmitFeedback from '$lib/components/SubmitFeedback.svelte';
	import type { Scale } from '$lib/services/api';
	import { submitLog } from '$lib/services/api';
	import { latestStore } from '$lib/stores/latest.svelte';
	import { userStore } from '$lib/stores/user.svelte';
	import { relativeTime } from '$lib/utils/time';

	type SubmitState = 'idle' | 'loading' | 'success' | 'error';

	let poop = $state<Scale>('None');
	let pee = $state<Scale>('None');
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

	const lastNappy = $derived(latestStore.lastNappyChange);
	const lastNappyDetail = $derived.by(() => {
		if (!lastNappy) return '';
		const parts: string[] = [];
		if (lastNappy.poop && lastNappy.poop !== 'None') parts.push(`${lastNappy.poop} poop`);
		if (lastNappy.pee && lastNappy.pee !== 'None') parts.push(`${lastNappy.pee} pee`);
		return parts.length > 0 ? parts.join(' · ') : 'Dry';
	});

	async function save(): Promise<void> {
		if (submitState !== 'idle') return;

		submitState = 'loading';
		const result = await submitLog({
			user: userStore.current,
			type: 'nappy',
			poop,
			pee,
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
		<h2 class="text-2xl font-bold text-ink">🧷 Nappy Change</h2>
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

		{#if lastNappy}
			<p class="text-sm text-ink-subtle">Last nappy: {lastNappyDetail} · {relativeTime(lastNappy.timestamp, now)} · {lastNappy.user}</p>
		{/if}
		<section>
			<ScaleSelector bind:value={poop} label="Poop" variant="poop" />
		</section>

		<section>
			<ScaleSelector bind:value={pee} label="Pee" variant="pee" />
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

		<div class="mt-auto">
			<button
				type="button"
				onclick={save}
				class="w-full rounded-2xl bg-brand py-4 text-xl font-bold text-white shadow-sm transition-colors hover:bg-brand-hover active:bg-brand-active"
			>
				Save
			</button>
		</div>
	{/if}
</div>
