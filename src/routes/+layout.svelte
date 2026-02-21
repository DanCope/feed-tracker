<script lang="ts">
	import { base } from '$app/paths';
	import UserToggle from '$lib/components/UserToggle.svelte';
	import { configStore } from '$lib/stores/config.svelte';
	import { latestStore } from '$lib/stores/latest.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';
	import '../app.css';

	interface Props {
		children: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	$effect(() => {
		configStore.init();
		themeStore.init();
		latestStore.init();
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#4d6e52" />
</svelte:head>

<div class="flex min-h-dvh flex-col bg-surface text-ink">
	<header class="sticky top-0 z-10 flex items-center justify-between bg-brand px-4 py-3 text-white shadow-md">
		<h1 class="text-xl font-bold tracking-tight">🍼 Feed Tracker</h1>
		<div class="flex items-center gap-3">
			<UserToggle />
			<a
				href="{base}/settings"
				class="rounded-full p-1 transition-colors hover:bg-brand-hover"
				aria-label="Settings"
			>
				⚙️
			</a>
		</div>
	</header>
	<main class="flex flex-1 flex-col">
		{@render children()}
	</main>
</div>
