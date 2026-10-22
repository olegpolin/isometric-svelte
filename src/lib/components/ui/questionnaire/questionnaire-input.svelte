<script lang="ts">
	import { Questionnaire as QuestionnairePrimitive } from "@shadcn-svelte/primitives/questionnaire";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		...restProps
	}: QuestionnairePrimitive.InputProps = $props();
</script>

<div
	data-slot="questionnaire-input-wrapper"
	class="w-full group/questionnaire-input relative min-w-0"
>
	<QuestionnairePrimitive.Input
		bind:ref
		data-slot="questionnaire-input"
		class={cn(
			"bg-card border-input focus-visible:focus-halo aria-invalid:border-destructive h-8 rounded-md border px-2.5 py-1 text-base md:text-sm min-h-11 w-full min-w-0 transition-[color,box-shadow,background-color,border-color] duration-(--dur-1) ease-out outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 sm:min-h-0",
			"placeholder:text-muted-foreground",
			className
		)}
		{...restProps}
	/>
</div>
