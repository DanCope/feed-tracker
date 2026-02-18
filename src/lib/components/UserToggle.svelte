<script lang="ts">
	import { userStore, type User } from '$lib/stores/user.svelte';

	$effect(() => {
		userStore.init();
	});

	const options: User[] = ['Mum', 'Dad'];
</script>

<div class="flex gap-1 rounded-full bg-violet-900 p-1" role="group" aria-label="Select user">
	{#each options as option}
		<button
			type="button"
			class="min-w-[3.5rem] rounded-full px-3 py-1 text-sm font-semibold transition-colors"
			class:bg-white={userStore.current === option}
			class:text-violet-700={userStore.current === option}
			class:text-violet-200={userStore.current !== option}
			onclick={() => userStore.set(option)}
			aria-pressed={userStore.current === option}
		>
			{option}
		</button>
	{/each}
</div>
