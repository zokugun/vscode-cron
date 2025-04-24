import { Scheduler } from '../scheduler.js';

export async function unregisterTask(uuid: string): Promise<boolean> {
	const scheduler = Scheduler.get();

	return scheduler.removeTask(uuid);
}
