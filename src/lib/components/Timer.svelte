<script lang="ts">
	type TimerState = 'idle' | 'running' | 'paused';

	interface Props {
		elapsedSeconds?: number;
		running?: boolean;
		ondone?: (seconds: number) => void;
	}

	let { elapsedSeconds = $bindable(0), running = $bindable(false), ondone }: Props = $props();

	let timer = $state<TimerState>('idle');
	let startedAt = $state<number | null>(null);
	let accumulated = $state(0); // seconds banked before the last pause
	let now = $state(Date.now()); // updated by interval so $derived reacts

	const totalSeconds = $derived(
		timer === 'running' && startedAt !== null
			? accumulated + Math.floor((now - startedAt) / 1000)
			: accumulated
	);

	const display = $derived(
		`${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${(totalSeconds % 60).toString().padStart(2, '0')}`
	);

	$effect(() => {
		if (timer !== 'running') return;

		const id = setInterval(() => {
			now = Date.now();
			elapsedSeconds = totalSeconds;
		}, 500);

		return () => clearInterval(id);
	});

	function start(): void {
		now = Date.now();
		startedAt = now;
		running = true;
		timer = 'running';
	}

	function stop(): void {
		if (startedAt !== null) {
			accumulated += Math.floor((Date.now() - startedAt) / 1000);
			startedAt = null;
		}
		elapsedSeconds = accumulated;
		running = false;
		timer = 'paused';
		ondone?.(elapsedSeconds);
	}
</script>

<div class="flex flex-col items-center gap-4">
	<!-- Elapsed time display -->
	<div class="flex items-center gap-2">
		{#if timer === 'running'}
			<span class="h-2.5 w-2.5 animate-pulse rounded-full bg-signal" aria-hidden="true"></span>
		{/if}
		<span
			class="font-mono text-5xl font-bold tabular-nums"
		class:text-ink={timer !== 'running'}
		class:text-signal={timer === 'running'}
			aria-live="off"
			aria-label="Elapsed time {display}"
		>
			{display}
		</span>
	</div>

	<!-- Controls -->
	{#if timer === 'idle'}
		<button
			type="button"
			onclick={start}
			class="min-w-[10rem] rounded-full bg-signal px-8 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-signal-hover active:bg-signal-hover"
		>
			Start
		</button>
	{:else if timer === 'running'}
		<button
			type="button"
			onclick={stop}
			class="min-w-[10rem] rounded-full border border-edge bg-surface-raised px-8 py-3 text-lg font-semibold text-ink shadow-sm transition-colors hover:bg-surface-tint active:bg-surface-tint"
		>
			Stop
		</button>
	{:else if timer === 'paused'}
		<button
			type="button"
			onclick={start}
			class="min-w-[10rem] rounded-full border border-edge bg-surface-raised px-8 py-3 text-lg font-semibold text-ink shadow-sm transition-colors hover:bg-surface-tint active:bg-surface-tint"
		>
			Resume
		</button>
	{/if}
</div>
