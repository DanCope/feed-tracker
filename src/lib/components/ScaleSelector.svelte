<script lang="ts">
	import type { Scale } from '$lib/services/api';

	type Variant = 'poop' | 'pee';

	interface Props {
		value?: Scale;
		label?: string;
		variant?: Variant;
	}

	let { value = $bindable('None'), label = 'Amount', variant = 'poop' }: Props = $props();

	const options: { scale: Scale; size: string }[] = [
		{ scale: 'None',   size: '' },
		{ scale: 'Small',  size: 'h-5 w-5' },
		{ scale: 'Medium', size: 'h-8 w-8' },
		{ scale: 'Large',  size: 'h-12 w-12' },
	];
</script>

<div class="flex flex-col gap-3">
	<p class="text-sm font-semibold uppercase tracking-wider text-ink-subtle">{label}</p>
	<div class="grid grid-cols-4 gap-2" role="group" aria-label="{label} scale">
		{#each options as opt}
			<button
				type="button"
				onclick={() => (value = opt.scale)}
				aria-pressed={value === opt.scale}
				class="flex flex-col items-center justify-center gap-2 rounded-2xl py-4 transition-colors"
				class:ring-2={value === opt.scale}
				class:bg-brand-subtle={value === opt.scale}
				class:ring-brand={value === opt.scale}
				class:bg-surface-tint={value !== opt.scale}
			>
				<span class="flex h-12 w-12 items-center justify-center">
					{#if opt.scale === 'None'}
						<span class="text-lg font-bold text-gray-300">—</span>
					{:else if variant === 'poop'}
						<span class="rounded-full bg-amber-900 {opt.size}" aria-hidden="true"></span>
					{:else}
						<span class="rounded-full bg-yellow-300 {opt.size}" aria-hidden="true"></span>
					{/if}
				</span>
				<span
					class="text-xs font-medium"
					class:text-ink={value === opt.scale}
					class:font-bold={value === opt.scale}
					class:text-ink-subtle={value !== opt.scale}
				>{opt.scale}</span>
			</button>
		{/each}
	</div>
</div>
