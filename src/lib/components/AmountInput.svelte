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
	<p class="text-sm font-semibold uppercase tracking-wider text-gray-500">{label}</p>

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
			class="w-24 rounded-xl border border-gray-200 bg-white py-2 text-center text-3xl font-bold text-gray-800 shadow-sm focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-200"
		/>
		<span class="text-base font-medium text-gray-400">ml</span>
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
		class="h-2 w-full cursor-pointer appearance-none rounded-full bg-gray-200 accent-violet-600"
	/>
	<div class="flex justify-between text-xs text-gray-400">
		<span>0 ml</span>
		<span>{max} ml</span>
	</div>
</div>

