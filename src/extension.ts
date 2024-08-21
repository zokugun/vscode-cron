import vscode from 'vscode';
import pkg from '../package.json';
import { registerTask } from './commands/register-task';
import { showTestMessage } from './commands/show-test-message';
import { unregisterTask } from './commands/unregister-task';
import { Scheduler, TaskKind } from './scheduler';
import * as window from './window';

const CONFIG_KEY = 'cronTasks';
const VERSION_KEY = 'version';

type Task = {
	at: string;
	run: string;
	args?: string[];
};

function setup(): void { // {{{
	const config = vscode.workspace.getConfiguration(CONFIG_KEY, null);
	const scheduler = Scheduler.get().setup(config);

	scheduler.removeTasks(TaskKind.Config);

	for(const { at, run, args } of config.get<Task[]>('tasks') ?? []) {
		scheduler.addTask({
			kind: TaskKind.Config,
			pattern: at,
			command: run,
			args,
		});
	}
} // }}}

async function showWhatsNewMessage(version: string) { // {{{
	const actions: vscode.MessageItem[] = [{
		title: 'Homepage',
	}, {
		title: 'Release Notes',
	}];

	const result = await vscode.window.showInformationMessage(
		`Cron Tasks has been updated to v${version} — check out what's new!`,
		...actions,
	);

	if(result !== null) {
		if(result === actions[0]) {
			await vscode.commands.executeCommand(
				'vscode.open',
				vscode.Uri.parse(`${pkg.homepage}`),
			);
		}
		else if(result === actions[1]) {
			await vscode.commands.executeCommand(
				'vscode.open',
				vscode.Uri.parse(`${pkg.homepage}/blob/master/CHANGELOG.md`),
			);
		}
	}
} // }}}

export async function activate(context: vscode.ExtensionContext): Promise<void> { // {{{
	const previousVersion = context.globalState.get<string>(VERSION_KEY);
	const currentVersion = pkg.version;

	const config = vscode.workspace.getConfiguration(CONFIG_KEY);

	if(previousVersion === undefined || currentVersion !== previousVersion) {
		void context.globalState.update(VERSION_KEY, currentVersion);

		const notification = config.get<string>('notification');

		if(previousVersion === undefined) {
			// don't show notification on install
		}
		else if(notification === 'major') {
			if(currentVersion.split('.')[0] > previousVersion.split('.')[0]) {
				void showWhatsNewMessage(currentVersion);
			}
		}
		else if(notification === 'minor') {
			if(currentVersion.split('.')[0] > previousVersion.split('.')[0] || (currentVersion.split('.')[0] === previousVersion.split('.')[0] && currentVersion.split('.')[1] > previousVersion.split('.')[1])) {
				void showWhatsNewMessage(currentVersion);
			}
		}
		else if(notification !== 'none') {
			void showWhatsNewMessage(currentVersion);
		}
	}

	setup();

	vscode.workspace.onDidChangeConfiguration((event) => {
		if(event.affectsConfiguration(CONFIG_KEY)) {
			setup();
		}
	});

	const disposables: vscode.Disposable[] = [];

	disposables.push(
		vscode.commands.registerCommand(`${CONFIG_KEY}.register`, registerTask),
		vscode.commands.registerCommand(`${CONFIG_KEY}.unregister`, unregisterTask),
		vscode.commands.registerCommand(`${CONFIG_KEY}.showTestMessage`, showTestMessage),
	);

	context.subscriptions.push(...disposables);

	await window.activate(context);
} // }}}

export async function deactivate(): Promise<void> { // {{{
	return window.deactivate();
} // }}}
