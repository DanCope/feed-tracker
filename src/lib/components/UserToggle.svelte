<script lang="ts">
	import { userStore, type User } from '$lib/stores/user.svelte';

	$effect(() => {
		userStore.init();
	});

	const options: User[] = ['Mum', 'Dad'];
</script>

<div class="flex gap-1 rounded-full bg-brand-active p-1" role="group" aria-label="Select user">
	{#each options as option}
		<button
			type="button"
			class="min-w-[3.5rem] rounded-full px-3 py-1 text-sm font-semibold transition-colors {userStore.current === option
				? 'bg-surface-raised text-brand'
				: 'text-white/60'}"
			onclick={() => userStore.set(option)}
			aria-pressed={userStore.current === option}
		>
			{option}
		</button>
	{/each}
</div>
