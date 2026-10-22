<script lang="ts">
	import { Questionnaire as QuestionnairePrimitive } from "@shadcn-svelte/primitives/questionnaire";
	import CheckIcon from "@lucide/svelte/icons/check";
	import { cn } from "#lib/utils.js";

	let {
		ref = $bindable(null),
		children,
		class: className,
		...restProps
	}: QuestionnairePrimitive.ChoiceProps = $props();
</script>

<QuestionnairePrimitive.Choice
	bind:ref
	data-slot="questionnaire-choice"
	class={cn(
		"border-border bg-card hover:bg-accent data-checked:border-muted-foreground data-checked:bg-accent data-invalid:border-destructive has-[>input:focus-visible]:focus-halo gap-2.5 rounded-lg border px-3 py-2.5 text-sm group/questionnaire-choice relative flex min-h-11 cursor-pointer items-start text-start transition-[background-color,border-color,box-shadow] duration-(--dur-1) ease-out outline-none select-none",
		"data-disabled:pointer-events-none data-disabled:cursor-not-allowed data-disabled:opacity-50",
		className
	)}
	{...restProps}
>
	<QuestionnairePrimitive.ChoiceInput
		data-slot="questionnaire-choice-input"
		class="absolute inset-0 z-10 size-full cursor-pointer opacity-0"
	/>
	<span
		aria-hidden="true"
		data-slot="questionnaire-choice-indicator"
		class="border-input bg-card group-data-[type=checkbox]/questionnaire-choice:group-data-checked/questionnaire-choice:bg-primary group-data-[type=checkbox]/questionnaire-choice:group-data-checked/questionnaire-choice:text-primary-foreground group-data-[type=checkbox]/questionnaire-choice:group-data-checked/questionnaire-choice:border-primary group-data-[type=radio]/questionnaire-choice:group-data-checked/questionnaire-choice:border-foreground size-4 translate-y-[--spacing(0.45)] group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 rounded-sm pointer-events-none relative flex shrink-0 items-center justify-center border transition-[background-color,border-color] duration-(--dur-1) ease-out group-data-[type=radio]/questionnaire-choice:rounded-full"
	>
		<span
			data-slot="questionnaire-choice-indicator-dot"
			class="bg-primary size-2 hidden rounded-full group-data-[type=checkbox]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block"
		></span>
		<CheckIcon data-slot="questionnaire-choice-indicator-check" class="size-3.5 hidden group-data-[type=radio]/questionnaire-choice:hidden group-data-checked/questionnaire-choice:block" />
	</span>
	<QuestionnairePrimitive.ChoiceLabel
		data-slot="questionnaire-choice-label"
		class="gap-0.5 flex min-w-0 flex-1 flex-col leading-snug"
	>
		{@render children?.()}
	</QuestionnairePrimitive.ChoiceLabel>
	<QuestionnairePrimitive.ChoiceShortcut
		data-slot="questionnaire-choice-shortcut"
		class="bg-face-top border-border shadow-face-sm text-muted-foreground min-w-5 h-5 px-1 translate-y-[--spacing(0.45)] group-has-data-[slot=questionnaire-choice-description]/questionnaire-choice:translate-y-0.5 items-center justify-center rounded-sm border font-sans text-xs leading-none pointer-events-none ms-auto hidden shrink-0 group-data-[shortcut]/questionnaire-choice:inline-flex"
	/>
</QuestionnairePrimitive.Choice>
