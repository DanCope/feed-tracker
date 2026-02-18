<script lang="ts">
	type TimerState = 'idle' | 'running' | 'paused';

	interface Props {
		elapsedSeconds?: number;
		running?: boolean;
		ondone?: (seconds: number) => void;
	}

	let { elapsedSeconds = $bindable(0), running = $bindable(false), ondone }: Props = $props();

	let state = $state<TimerState>('idle');
	let startedAt = $state<number | null>(null);
	let accumulated = $state(0); // seconds banked before the last pause
	let now = $state(Date.now()); // updated by interval so $derived reacts

	const totalSeconds = $derived(
		state === 'running' && startedAt !== null
			? accumulated + Math.floor((now - startedAt) / 1000)
			: accumulated
	);

	const display = $derived(
		`${Math.floor(totalSeconds / 60).toString().padStart(2, '0')}:${(totalSeconds % 60).toString().padStart(2, '0')}`
	);

	$effect(() => {
		if (state !== 'running') return;

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
		state = 'running';
	}

	function stop(): void {
		if (startedAt !== null) {
			accumulated += Math.floor((Date.now() - startedAt) / 1000);
			startedAt = null;
		}
		elapsedSeconds = accumulated;
		running = false;
		state = 'paused';
		ondone?.(elapsedSeconds);
	}
</script>

<div class="flex flex-col items-center gap-4">
	<!-- Elapsed time display -->
	<div class="flex items-center gap-2">
		{#if state === 'running'}
			<span class="h-2.5 w-2.5 animate-pulse rounded-full bg-rose-500" aria-hidden="true"></span>
		{/if}
		<span
			class="font-mono text-5xl font-bold tabular-nums"
			class:text-gray-800={state !== 'running'}
			class:text-rose-600={state === 'running'}
			aria-live="off"
			aria-label="Elapsed time {display}"
		>
			{display}
		</span>
	</div>

	<!-- Controls -->
	{#if state === 'idle'}
		<button
			type="button"
			onclick={start}
			class="min-w-[10rem] rounded-full bg-rose-600 px-8 py-3 text-lg font-semibold text-white shadow-sm transition-colors hover:bg-rose-700 active:bg-rose-800"
		>
			Start
		</button>
	{:else if state === 'running'}
		<button
			type="button"
			onclick={stop}
			class="min-w-[10rem] rounded-full bg-gray-200 px-8 py-3 text-lg font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 active:bg-gray-400"
		>
			Stop
		</button>
	{:else if state === 'paused'}
		<button
			type="button"
			onclick={start}
			class="min-w-[10rem] rounded-full bg-gray-200 px-8 py-3 text-lg font-semibold text-gray-800 shadow-sm transition-colors hover:bg-gray-300 active:bg-gray-400"
		>
			Resume
		</button>
	{/if}
</div>
