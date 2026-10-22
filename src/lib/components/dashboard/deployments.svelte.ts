import { DEPLOYMENTS, type Deployment, type Environment } from './data.js';

const randomSha = () =>
	Array.from({ length: 7 }, () => Math.floor(Math.random() * 16).toString(16)).join('');

/** The deployments list, shared by the toolbar dialog and the table. */
export class Deployments {
	list = $state<Deployment[]>(structuredClone(DEPLOYMENTS));

	queue(branch: string, env: Environment, message = 'Manual deployment') {
		const deployment: Deployment = {
			sha: randomSha(),
			message,
			branch,
			env,
			author: 'ines',
			duration: null,
			status: 'queued',
			age: 'Just now'
		};
		this.list.unshift(deployment);
		return deployment;
	}

	redeploy(from: Deployment) {
		return this.queue(from.branch, from.env, `Redeploy of ${from.sha}`);
	}

	cancel(sha: string) {
		const d = this.list.find((x) => x.sha === sha);
		if (d && d.status === 'queued') {
			d.status = 'cancelled';
			d.duration = 0;
		}
	}
}
