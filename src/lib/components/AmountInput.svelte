<script lang="ts">
	interface Props {
		value?: number;
		label?: string;
		max?: number;
	}

	let {
		value = $bindable(0),
		label = 'Amount',
		max = 250,
	}: Props = $props();

	function onSlider(e: Event): void {
		value = parseInt((e.target as HTMLInputElement).value, 10);
	}

	function onInput(e: Event): void {
		const raw = parseInt((e.target as HTMLInputElement).value, 10);
		if (!isNaN(raw)) {
			value = Math.min(max, Math.max(0, raw));
		}
	}
</script>

<div class="flex flex-col gap-3">
	<p class="text-sm font-semibold uppercase tracking-wider text-ink-subtle">{label}</p>

	<!-- Value display -->
	<div class="flex items-baseline justify-center gap-1">
		<input
			type="number"
			inputmode="numeric"
			min="0"
			max={max}
			{value}
			oninput={onInput}
			aria-label="{label} in millilitres"
			class="w-24 rounded-xl border border-edge bg-surface-raised py-2 text-center text-3xl font-bold text-ink shadow-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/25"
		/>
		<span class="text-base font-medium text-ink-placeholder">ml</span>
	</div>

	<!-- Slider -->
	<input
		type="range"
		min="0"
		max={max}
		step="5"
		{value}
		oninput={onSlider}
		aria-label="{label} slider"
		class="h-2 w-full cursor-pointer appearance-none rounded-full bg-edge accent-brand"
	/>
	<div class="flex justify-between text-xs text-ink-subtle">
		<span>0 ml</span>
		<span>{max} ml</span>
	</div>
</div>

