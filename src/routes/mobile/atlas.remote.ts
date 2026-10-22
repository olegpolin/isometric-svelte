import { command, query } from '$app/server';
import { error } from '@sveltejs/kit';
import { WORKS } from '#lib/components/mobile/atlas-data.js';

/** Every work in the park, in catalogue order. */
export const getWorks = query(async () => WORKS);

export interface Reservation {
	date: string;
	slot: string;
	visitors: number;
	email: string;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Holds a visit and returns its booking reference. Nothing is stored; this is a showcase. */
export const reserveVisit = command('unchecked', async (input: Reservation) => {
	if (!input || typeof input.date !== 'string' || typeof input.slot !== 'string') {
		error(400, 'Choose a date and a time slot');
	}
	if (typeof input.email !== 'string' || !EMAIL.test(input.email)) {
		error(400, 'Enter an email address for the tickets');
	}
	const visitors = Number(input.visitors);
	if (!Number.isInteger(visitors) || visitors < 1 || visitors > 6) {
		error(400, 'Choose between one and six visitors');
	}
	const reference = `ATL-${Math.floor(1000 + Math.random() * 9000)}`;
	return { reference };
});
