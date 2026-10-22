<script lang="ts">
	import { getLocalTimeZone, today, type DateValue } from '@internationalized/date';
	import { toast } from 'svelte-sonner';
	import { Screen, TIME_SLOTS, TRANSIT } from '#lib/components/mobile/index.js';
	import * as AlertDialog from '#lib/components/ui/alert-dialog/index.js';
	import { Button } from '#lib/components/ui/button/index.js';
	import { Calendar } from '#lib/components/ui/calendar/index.js';
	import * as Card from '#lib/components/ui/card/index.js';
	import * as Field from '#lib/components/ui/field/index.js';
	import { Input } from '#lib/components/ui/input/index.js';
	import * as RadioGroup from '#lib/components/ui/radio-group/index.js';
	import * as Select from '#lib/components/ui/select/index.js';
	import { Spinner } from '#lib/components/ui/spinner/index.js';
	import * as Table from '#lib/components/ui/table/index.js';
	import { reserveVisit } from '../atlas.remote';

	const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	const VISITOR_COUNTS = ['1', '2', '3', '4', '5', '6'];

	const tz = getLocalTimeZone();
	const first = today(tz);
	const last = first.add({ months: 3 });

	/** The park is closed on Mondays. */
	const isClosed = (d: DateValue) => d.toDate(tz).getDay() === 1;

	let date = $state<DateValue | undefined>();
	let slot = $state('');
	let visitors = $state('2');
	let email = $state('');
	let attempted = $state(false);
	let confirming = $state(false);
	let pending = $state(false);

	const dateInvalid = $derived(attempted && !date);
	const slotInvalid = $derived(attempted && !slot);
	const emailInvalid = $derived(attempted && !EMAIL.test(email));

	const dateLabel = $derived(
		date ? date.toDate(tz).toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' }) : ''
	);
	const slotLabel = $derived(TIME_SLOTS.find((s) => s.value === slot)?.label ?? '');
	const visitorsLabel = $derived(`${visitors} ${visitors === '1' ? 'visitor' : 'visitors'}`);

	// What the dialog shows, frozen when it opens so the form can reset while it closes.
	let summary = $state({ date: '', slot: '', visitors: '', email: '' });

	function review() {
		attempted = true;
		if (!date || !slot || !EMAIL.test(email)) return;
		summary = { date: dateLabel, slot: slotLabel, visitors: visitorsLabel, email };
		confirming = true;
	}

	async function confirm() {
		if (!date) return;
		pending = true;
		try {
			const { reference } = await reserveVisit({
				date: date.toString(),
				slot,
				visitors: Number(visitors),
				email
			});
			confirming = false;
			toast.success(`Reserved for ${summary.date}`, {
				description: `${summary.slot}, ${summary.visitors}. Reference ${reference}; tickets sent to ${summary.email}.`
			});
			date = undefined;
			slot = '';
			attempted = false;
		} catch (e) {
			const message = (e as { body?: { message?: string } })?.body?.message;
			toast.error('Could not reserve this visit', { description: message ?? 'Check your connection and try again.' });
		} finally {
			pending = false;
		}
	}
</script>

<Screen eyebrow="Tickets are free" title="Plan a visit">
	<form
		class="flex flex-col gap-8"
		novalidate
		onsubmit={(e) => {
			e.preventDefault();
			review();
		}}
	>
		<Field.FieldSet data-invalid={dateInvalid || undefined}>
			<Field.Legend variant="legend">Date</Field.Legend>
			<Field.Description>Open Tuesday to Sunday, 10:00 to 18:00.</Field.Description>
			<Card.Root size="sm">
				<Card.Content class="flex justify-center">
					<Calendar
						type="single"
						bind:value={date}
						minValue={first}
						maxValue={last}
						isDateUnavailable={isClosed}
						weekStartsOn={1}
						locale="en-GB"
						class="p-0 [--cell-size:--spacing(11)]"
						aria-label="Visit date"
					/>
				</Card.Content>
			</Card.Root>
			{#if dateInvalid}
				<Field.Error>Choose a date.</Field.Error>
			{/if}
		</Field.FieldSet>

		<Field.FieldSet data-invalid={slotInvalid || undefined}>
			<Field.Legend variant="legend">Time slot</Field.Legend>
			<RadioGroup.Root bind:value={slot} aria-invalid={slotInvalid || undefined}>
				{#each TIME_SLOTS as s (s.value)}
					{@const id = `slot-${s.value.replace(':', '')}`}
					<Field.Label for={id}>
						<Field.Field orientation="horizontal">
							<Field.Content>
								<Field.Title class="tabular-nums">{s.label}</Field.Title>
								<Field.Description>{s.note}</Field.Description>
							</Field.Content>
							<RadioGroup.Item value={s.value} {id} />
						</Field.Field>
					</Field.Label>
				{/each}
			</RadioGroup.Root>
			{#if slotInvalid}
				<Field.Error>Choose a time slot.</Field.Error>
			{/if}
		</Field.FieldSet>

		<Field.FieldSet>
			<Field.Legend variant="legend">Your party</Field.Legend>
			<Field.Group>
				<Field.Field>
					<Field.Label for="visitors">Visitors</Field.Label>
					<Select.Root type="single" bind:value={visitors}>
						<Select.Trigger id="visitors" class="w-full data-[size=default]:h-11">{visitorsLabel}</Select.Trigger>
						<Select.Content>
							<Select.Group>
								{#each VISITOR_COUNTS as n (n)}
									<Select.Item value={n} label="{n} {n === '1' ? 'visitor' : 'visitors'}" class="h-11" />
								{/each}
							</Select.Group>
						</Select.Content>
					</Select.Root>
				</Field.Field>
				<Field.Field data-invalid={emailInvalid || undefined}>
					<Field.Label for="email">Email</Field.Label>
					<Input
						id="email"
						type="email"
						autocomplete="email"
						placeholder="you@example.com"
						bind:value={email}
						aria-invalid={emailInvalid || undefined}
						aria-describedby="email-note"
						class="h-11"
					/>
					{#if emailInvalid}
						<Field.Error id="email-note">Enter an email address for the tickets.</Field.Error>
					{:else}
						<Field.Description id="email-note">We send the tickets here and nowhere else.</Field.Description>
					{/if}
				</Field.Field>
			</Field.Group>
		</Field.FieldSet>

		<Button type="submit" size="lg" class="h-11 w-full">Reserve</Button>
	</form>

	<Card.Root>
		<Card.Header>
			<Card.Title>Getting there</Card.Title>
			<Card.Description>All three stop at the north gate, a minute from the cairn.</Card.Description>
		</Card.Header>
		<Card.Content>
			<Table.Root>
				<Table.Header>
					<Table.Row>
						<Table.Head>Line</Table.Head>
						<Table.Head>From</Table.Head>
						<Table.Head class="text-right">Every</Table.Head>
					</Table.Row>
				</Table.Header>
				<Table.Body>
					{#each TRANSIT as t (t.line)}
						<Table.Row>
							<Table.Cell class="font-medium">{t.line}</Table.Cell>
							<Table.Cell>{t.from}</Table.Cell>
							<Table.Cell class="text-right tabular-nums">{t.every}</Table.Cell>
						</Table.Row>
					{/each}
				</Table.Body>
			</Table.Root>
		</Card.Content>
	</Card.Root>
</Screen>

<AlertDialog.Root bind:open={confirming}>
	<AlertDialog.Content>
		<AlertDialog.Header>
			<AlertDialog.Title>Reserve {summary.date}?</AlertDialog.Title>
			<AlertDialog.Description>
				{summary.slot}, {summary.visitors}. We will send the tickets to {summary.email}.
			</AlertDialog.Description>
		</AlertDialog.Header>
		<AlertDialog.Footer>
			<AlertDialog.Cancel class="h-11" disabled={pending}>Keep editing</AlertDialog.Cancel>
			<AlertDialog.Action class="h-11" disabled={pending} onclick={confirm}>
				{#if pending}
					<Spinner data-icon="inline-start" />
				{/if}
				Confirm reservation
			</AlertDialog.Action>
		</AlertDialog.Footer>
	</AlertDialog.Content>
</AlertDialog.Root>
