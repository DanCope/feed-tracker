<script lang="ts">
	import { base } from '$app/paths';
</script>

<div class="flex flex-1 flex-col items-center justify-center gap-4 p-6">
	<p class="text-sm font-medium uppercase tracking-widest text-gray-400">What happened?</p>

	<div class="flex w-full max-w-sm flex-col gap-4">
		<a
			href="{base}/breast-feed"
			class="flex min-h-[5rem] items-center gap-4 rounded-2xl bg-rose-50 px-6 text-left shadow-sm transition-colors hover:bg-rose-100 active:bg-rose-200"
		>
			<span class="text-4xl" aria-hidden="true">🤱</span>
			<div>
				<p class="text-xl font-bold text-rose-700">Breast Feed</p>
				<p class="text-sm text-rose-500">Left or right, with timer</p>
			</div>
		</a>

		<a
			href="{base}/bottle-feed"
			class="flex min-h-[5rem] items-center gap-4 rounded-2xl bg-sky-50 px-6 text-left shadow-sm transition-colors hover:bg-sky-100 active:bg-sky-200"
		>
			<span class="text-4xl" aria-hidden="true">🍼</span>
			<div>
				<p class="text-xl font-bold text-sky-700">Bottle Feed</p>
				<p class="text-sm text-sky-500">Before &amp; after amounts</p>
			</div>
		</a>

		<a
			href="{base}/nappy-change"
			class="flex min-h-[5rem] items-center gap-4 rounded-2xl bg-amber-50 px-6 text-left shadow-sm transition-colors hover:bg-amber-100 active:bg-amber-200"
		>
			<span class="text-4xl" aria-hidden="true">🧷</span>
			<div>
				<p class="text-xl font-bold text-amber-700">Nappy Change</p>
				<p class="text-sm text-amber-500">Poop &amp; pee scale</p>
			</div>
		</a>
	</div>
</div>
