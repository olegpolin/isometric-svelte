<script lang="ts" module>
	import { tv, type VariantProps } from "tailwind-variants";

	export const attachmentVariants = tv({
		base: "rounded-lg w-fit has-[[data-slot=attachment-trigger]:focus-visible]:focus-halo group/attachment relative flex max-w-full min-w-0 shrink-0 flex-wrap border border-border bg-card text-card-foreground transition-[background-color,border-color,box-shadow] duration-(--dur-1) ease-out has-[>a,>button]:hover:bg-accent data-[state=error]:border-destructive data-[state=idle]:border-dashed data-[state=idle]:border-input",
		variants: {
			size: {
				default: "gap-2 has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2 text-sm",
				sm: "gap-2.5 has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5 text-xs",
				xs: "gap-1.5 has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1 text-xs rounded-md",
			},
			orientation: {
				horizontal: "min-w-40 items-center",
				vertical: "w-24 has-data-[slot=attachment-content]:w-30 flex-col",
			},
		},
	});

	export type AttachmentSize = VariantProps<typeof attachmentVariants>["size"];
	export type AttachmentOrientation = VariantProps<typeof attachmentVariants>["orientation"];
	export type AttachmentState = "idle" | "uploading" | "processing" | "error" | "done";
</script>

<script lang="ts">
	import { cn, type WithElementRef } from "#lib/utils.js";
	import type { HTMLAttributes } from "svelte/elements";

	let {
		ref = $bindable(null),
		class: className,
		state = "done",
		size = "default",
		orientation = "horizontal",
		children,
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & {
		state?: AttachmentState;
		size?: AttachmentSize;
		orientation?: AttachmentOrientation;
	} = $props();
</script>

<div
	bind:this={ref}
	data-slot="attachment"
	data-state={state}
	data-size={size}
	data-orientation={orientation}
	class={cn(attachmentVariants({ size, orientation }), className)}
	{...restProps}
>
	{@render children?.()}
</div>
