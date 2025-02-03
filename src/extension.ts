import * as vscode from 'vscode';
import ollama from 'ollama';
import getWebviewContent from "./webview";

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "deepseek-ext" is now active!');

	const disposable = vscode.commands.registerCommand('deepseek-ext.start', async() => {

		const modelList = await ollama.list();
		let modelName = "";

		if(modelList.models.length === 0){
			vscode.window.showErrorMessage("No Models are available to use 🐛");
			return;
		}
		
		const panel = vscode.window.createWebviewPanel(
			'deepChat',
			'DeepSeek Chat',
			vscode.ViewColumn.One,
			{enableScripts : true}
		);

		panel.webview.html = getWebviewContent();

		modelList.models.forEach((item) => {
			panel.webview.postMessage({command : 'modelList', text : item.name, value : item.model});
		});

		panel.webview.onDidReceiveMessage(async (message : any) => {
			if(message.command === 'modelSelect'){
				modelName = message.text;
			}
			if(message.command === 'chat'){
				const userPrompt = message.text;

				let responseText = '';
				
				try{
					const streamResponse = await ollama.chat({
						model : modelName,
						messages : [{role : 'user', content : userPrompt}],
						stream : true
					});

					for await(const part of streamResponse){
						responseText += part.message.content;
						panel.webview.postMessage({command : 'chatResponse', text : responseText});
					}
				}catch(err){
					console.log(err);
					panel.webview.postMessage({command : 'chatResponse', text : `Error : ${String(err)}`});
				}
			}
		});
	});

	context.subscriptions.push(disposable);

}

// This method is called when your extension is deactivated
export function deactivate() {}
