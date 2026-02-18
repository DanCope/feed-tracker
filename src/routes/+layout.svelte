<script lang="ts">
	import '../app.css';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<svelte:head>
	<meta name="theme-color" content="#7c3aed" />
</svelte:head>

<div class="flex min-h-dvh flex-col bg-white text-gray-900">
	<header class="sticky top-0 z-10 flex items-center justify-between bg-violet-700 px-4 py-3 text-white shadow-md">
		<h1 class="text-xl font-bold tracking-tight">🍼 Feed Tracker</h1>
	</header>
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
</div>
