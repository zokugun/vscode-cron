import { Cron } from 'croner';
import uuidv4 from 'uuid-random';
import vscode from 'vscode';
import * as window from './window';

export type Task = {
	command: string;
	cron: Cron;
	kind: TaskKind;
	pattern: string;
	uuid: string;
	args?: string[];
};

export enum TaskKind {
	Command,
	Config,
}

export class Scheduler {
	private readonly _tasks: Record<string, Task> = {};
	private _channel!: vscode.OutputChannel;
	private _debug: boolean = false;
	private _useBlank: boolean = false;

	public static get(): Scheduler { // {{{
		return $instance;
	} // }}}

	public addTask({
		kind,
		pattern,
		command,
		args,
	}: {
		kind: TaskKind;
		pattern: string;
		command: string;
		args?: string[];
	}): string {
		// {{{
		const uuid = uuidv4();
		const cron = new Cron(pattern);
		const task: Task = {
			kind,
			pattern,
			command,
			cron,
			uuid,
			args,
		};

		cron.schedule(async () => this.run(task));

		this._tasks[uuid] = task;

		if(this._debug) {
			this._channel.show(true);
		}

		const next = cron.next();
		this._channel.appendLine(`[new-task](${task.uuid}) pattern: ${pattern}, command: ${command}, next: ${next ? next.toISOString() : '-no-'}`);

		return uuid;
	} // }}}

	public removeTask(uuid: string): boolean { // {{{
		if(this._tasks[uuid]) {
			this._channel.appendLine(`[del-task](${uuid})`);

			this._tasks[uuid].cron.stop();

			delete this._tasks[uuid];

			return true;
		}
		else {
			return false;
		}
	} // }}}

	public removeTasks(kind?: TaskKind): void { // {{{
		if(kind) {
			for(const [uuid, task] of Object.entries(this._tasks)) {
				task.cron.stop();

				this._channel.appendLine(`[del-task](${uuid})`);

				delete this._tasks[uuid];
			}
		}
		else {
			for(const [uuid, task] of Object.entries(this._tasks)) {
				task.cron.stop();

				this._channel.appendLine(`[del-task](${uuid})`);

				delete this._tasks[uuid];
			}
		}
	} // }}}

	private async run(task: Task): Promise<void> { // {{{
		if(this._debug) {
			this._channel.show(true);
		}

		const next = task.cron.next();

		if(await window.isMain()) {
			this._channel.appendLine(`[run-task](${task.uuid}) main: true, next: ${next ? next.toISOString() : '-no-'}`);

			if(this._useBlank) {
				this._channel.appendLine(`[exe-task](${task.uuid}) blank`);
			}
			else {
				this._channel.appendLine(`[exe-task](${task.uuid}) command: ${task.command}`);

				try {
					if(task.args) {
						this._channel.append(` args: ${task.args.join(', ')}`);
						await vscode.commands.executeCommand(
							task.command,
							...task.args
						);
					}
					else {
						await vscode.commands.executeCommand(task.command);
					}
				}
				catch (error: unknown) {
					this._channel.appendLine(`[error] ${String(error)}`);
				}
			}
		}
		else {
			this._channel.appendLine(`[run-task](${task.uuid}) main: false, next: ${next ? next.toISOString() : '-no-'}`);
		}
	} // }}}

	public setup(config: vscode.WorkspaceConfiguration): this { // {{{
		if(!this._channel) {
			this._channel = vscode.window.createOutputChannel('Cron Tasks');
		}

		const debug = config.get<boolean | string>('debug');

		if(typeof debug === 'boolean') {
			this._debug = debug;
			this._useBlank = false;
		}
		else if(debug === 'on') {
			this._debug = true;
			this._useBlank = false;
		}
		else if(debug === 'off') {
			this._debug = false;
			this._useBlank = false;
		}
		else if(debug === 'useBlank') {
			this._debug = true;
			this._useBlank = true;
		}

		return this;
	} // }}}
}

const $instance: Scheduler = new Scheduler();
