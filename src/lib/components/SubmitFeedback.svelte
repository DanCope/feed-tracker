<script lang="ts">
	import { goto } from '$app/navigation';
	import { base } from '$app/paths';

	type FeedbackState = 'idle' | 'loading' | 'success' | 'error';

	interface Props {
		state: FeedbackState;
		message?: string;
		onretry?: () => void;
	}

	let { state, message = 'Something went wrong. Please try again.', onretry }: Props = $props();

	$effect(() => {
		if (state !== 'success') return;

		navigator.vibrate?.(50);

		const id = setTimeout(() => goto(`${base}/`), 1500);
		return () => clearTimeout(id);
	});
</script>

{#if state === 'loading'}
	<div class="flex flex-col items-center gap-3 py-4" aria-live="polite" aria-busy="true">
		<span
			class="h-10 w-10 animate-spin rounded-full border-4 border-violet-200 border-t-violet-600"
			aria-hidden="true"
		></span>
		<p class="text-sm font-medium text-gray-500">Saving…</p>
	</div>
{:else if state === 'success'}
	<div class="flex flex-col items-center gap-3 py-4" aria-live="polite">
		<span class="text-5xl" aria-hidden="true">✅</span>
		<p class="text-xl font-bold text-green-700">Logged!</p>
	</div>
{:else if state === 'error'}
	<div class="flex flex-col items-center gap-4 rounded-2xl bg-red-50 p-5" aria-live="assertive">
		<p class="text-center text-sm font-medium text-red-700">{message}</p>
		<button
			type="button"
			onclick={onretry}
			class="rounded-full bg-red-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800"
		>
			Try Again
		</button>
	</div>
{/if}
