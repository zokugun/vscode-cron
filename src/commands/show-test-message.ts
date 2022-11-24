import vscode from 'vscode';

export async function showTestMessage(message: string = 'It\'s a test!'): Promise<void> {
	void vscode.window.showInformationMessage(
		`[TEST] ${message}`,
	);
}
