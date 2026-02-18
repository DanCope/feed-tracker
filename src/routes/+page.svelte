<script lang="ts">
	import { base } from '$app/paths';
</script>

<div class="flex flex-1 flex-col items-center justify-center gap-4 p-6">
	<p class="text-sm font-medium uppercase tracking-widest text-ink-subtle">What happened?</p>

	<div class="flex w-full max-w-sm flex-col gap-4">
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
</div>
