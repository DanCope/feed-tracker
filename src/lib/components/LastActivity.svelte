<script lang="ts">
	interface Props {
		emoji: string;
		label: string;
		detail: string;
		relativeTime: string;
		user: string;
	}

	let { emoji, label, detail, relativeTime, user }: Props = $props();
</script>

<div class="flex items-center gap-3 rounded-xl border border-edge bg-surface-raised px-4 py-3">
	<span class="text-2xl leading-none" aria-hidden="true">{emoji}</span>
	<div class="min-w-0 flex-1">
		<p class="text-sm font-semibold text-ink">
			{label}<span class="font-normal text-ink-subtle"> · {detail}</span>
		</p>
		<p class="text-xs text-ink-subtle">{relativeTime} · {user}</p>
	</div>
</div>
