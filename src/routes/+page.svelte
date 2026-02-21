<script lang="ts">
	import { base } from '$app/paths';
	import LastActivity from '$lib/components/LastActivity.svelte';
	import { latestStore } from '$lib/stores/latest.svelte';
	import { relativeTime } from '$lib/utils/time';

	let now = $state(Date.now());

	$effect(() => {
		latestStore.refresh();
		const interval = setInterval(() => {
			now = Date.now();
		}, 60_000);
		return () => clearInterval(interval);
	});

	const breastDetail = $derived.by(() => {
		const e = latestStore.lastBreastFeed;
		if (!e) return '';
		return e.side ? `${e.side} side` : 'Side not recorded';
	});

	const bottleDetail = $derived.by(() => {
		const e = latestStore.lastBottleFeed;
		if (!e) return '';
		const before = Number(e.amountBefore) || 0;
		const after = Number(e.amountAfter) || 0;
		return `${before - after} ml consumed`;
	});

	const nappyDetail = $derived.by(() => {
		const e = latestStore.lastNappyChange;
		if (!e) return '';
		const parts: string[] = [];
		if (e.poop && e.poop !== 'None') parts.push(`${e.poop} poop`);
		if (e.pee && e.pee !== 'None') parts.push(`${e.pee} pee`);
		return parts.length > 0 ? parts.join(' · ') : 'Dry nappy';
	});

	const hasAnyData = $derived(
		latestStore.lastBreastFeed !== null ||
			latestStore.lastBottleFeed !== null ||
			latestStore.lastNappyChange !== null
	);
</script>

<div class="flex flex-1 flex-col items-center gap-6 p-6 pt-8">
	<div class="flex w-full max-w-sm flex-col gap-4">
		<p class="text-sm font-medium uppercase tracking-widest text-ink-subtle">What happened?</p>

		<a
			href="{base}/breast-feed"
			class="flex min-h-[5rem] items-center gap-4 rounded-2xl border border-edge bg-surface-raised px-6 text-left shadow-sm transition-colors hover:bg-surface-tint active:bg-surface-tint"
		>
			<span class="text-4xl" aria-hidden="true">🤱</span>
			<div>
				<p class="text-xl font-bold text-ink">Breast Feed</p>
				<p class="text-sm text-ink-subtle">Left or right, with timer</p>
			</div>
		</a>

		<a
			href="{base}/bottle-feed"
			class="flex min-h-[5rem] items-center gap-4 rounded-2xl border border-edge bg-surface-raised px-6 text-left shadow-sm transition-colors hover:bg-surface-tint active:bg-surface-tint"
		>
			<span class="text-4xl" aria-hidden="true">🍼</span>
			<div>
				<p class="text-xl font-bold text-ink">Bottle Feed</p>
				<p class="text-sm text-ink-subtle">Before &amp; after amounts</p>
			</div>
		</a>

		<a
			href="{base}/nappy-change"
			class="flex min-h-[5rem] items-center gap-4 rounded-2xl border border-edge bg-surface-raised px-6 text-left shadow-sm transition-colors hover:bg-surface-tint active:bg-surface-tint"
		>
			<span class="text-4xl" aria-hidden="true">🧷</span>
			<div>
				<p class="text-xl font-bold text-ink">Nappy Change</p>
				<p class="text-sm text-ink-subtle">Poop &amp; pee scale</p>
			</div>
		</a>
	</div>

	<div class="w-full max-w-sm">
		<p class="mb-3 text-sm font-medium uppercase tracking-widest text-ink-subtle">Recent</p>

		{#if latestStore.isLoading}
			<p class="text-center text-sm text-ink-subtle">Loading…</p>
		{:else if !hasAnyData}
			<p class="text-center text-sm text-ink-subtle">No logs yet.</p>
		{:else}
			<div class="flex flex-col gap-2">
				{#if latestStore.lastBreastFeed}
					{@const entry = latestStore.lastBreastFeed}
					<LastActivity
						emoji="🤱"
						label="Breast Feed"
						detail={breastDetail}
						relativeTime={relativeTime(entry.timestamp, now)}
						user={entry.user}
					/>
				{/if}
				{#if latestStore.lastBottleFeed}
					{@const entry = latestStore.lastBottleFeed}
					<LastActivity
						emoji="🍼"
						label="Bottle Feed"
						detail={bottleDetail}
						relativeTime={relativeTime(entry.timestamp, now)}
						user={entry.user}
					/>
				{/if}
				{#if latestStore.lastNappyChange}
					{@const entry = latestStore.lastNappyChange}
					<LastActivity
						emoji="🧷"
						label="Nappy Change"
						detail={nappyDetail}
						relativeTime={relativeTime(entry.timestamp, now)}
						user={entry.user}
					/>
				{/if}
			</div>
		{/if}
	</div>
</div>
