import { Scheduler, TaskKind } from '../scheduler';

export async function registerTask(at: string, run: string): Promise<string> {
	const scheduler = Scheduler.get();

	return scheduler.addTask({
		kind: TaskKind.Config,
		pattern: at,
		command: run,
	});
}
