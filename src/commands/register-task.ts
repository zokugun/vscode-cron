import { Scheduler, TaskKind } from '../scheduler';

export async function registerTask(
	at: string,
	run: string,
	args?: string[],
): Promise<string> {
	const scheduler = Scheduler.get();

	return scheduler.addTask(TaskKind.Config, at, run, args);
}
