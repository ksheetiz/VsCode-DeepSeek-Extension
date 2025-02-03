import * as vscode from 'vscode';
import ollama from 'ollama';

export function activate(context: vscode.ExtensionContext) {

	console.log('Congratulations, your extension "deepseek-ext" is now active!');

	const disposable = vscode.commands.registerCommand('deepseek-ext.start', function () {
		
		const panel = vscode.window.createWebviewPanel(
			'deepChat',
			'DeepSeek Chat',
			vscode.ViewColumn.One,
			{enableScripts : true}
		);

		panel.webview.html = getWebviewContent();

		panel.webview.onDidReceiveMessage(async (message : any) => {
			if(message.command === 'chat'){
				const userPrompt = message.text;

				let responseText = '';

				try{
					const streamResponse = await ollama.chat({
						model : 'deepseek-r1:1.5b',
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

const getWebviewContent = ():string => {
	return(
		/*html*/`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Deep VS Code Extension</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        body {
            background-color: #f7f7f8;
            color: #353740;
            font-family: 'Inter', sans-serif;
        }
        #response {
            max-height: 400px;
            overflow-y: auto;
        }
        #prompt {
            resize: none;
            border-color: #d1d5db;
            transition: border-color 0.3s ease;
        }
        #prompt:focus {
            outline: none;
            border-color: #10a37f;
            box-shadow: 0 0 0 2px rgba(16, 163, 127, 0.2);
        }
        #askBtn {
            background-color: #10a37f;
            color: white;
            transition: background-color 0.3s ease;
        }
        #askBtn:hover {
            background-color: #0e8c6a;
        }
    </style>
</head>
<body class="p-4 flex flex-col items-center justify-center min-h-screen">
    <div class="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
        <h2 class="text-2xl font-bold mb-4 text-center text-gray-800">Deep VS Code Extension</h2>
        
        <textarea 
            id="prompt" 
            rows="3" 
            placeholder="Ask something . . ." 
            class="w-full p-3 border rounded-lg mb-4 focus:outline-none"
        ></textarea>
        
        <div class="flex justify-center mb-4">
            <button 
                id="askBtn" 
                class="px-6 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
                Ask
            </button>
        </div>
        
        <div 
            id="response" 
            class="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[200px]"
        >
            <!-- Response will be dynamically inserted here -->
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        const chatContainer = document.getElementById('response');
        const promptTextarea = document.getElementById('prompt');

        document.getElementById('askBtn').addEventListener('click', () => {
            const text = promptTextarea.value;
            if (text.trim() === '') return;

            // Clear previous response
            chatContainer.innerHTML = '';

            // Show loading state
            const loadingDiv = document.createElement('div');
            loadingDiv.className = 'text-center text-gray-500 animate-pulse';
            loadingDiv.textContent = 'Thinking...';
            chatContainer.appendChild(loadingDiv);

            // Send message to VS Code
            vscode.postMessage({command: 'chat', text});
            
            // Clear textarea
            promptTextarea.value = '';
        });

        window.addEventListener('message', event => {
            const {command, text} = event.data;
            if(command === "chatResponse"){
                // Clear loading state
                chatContainer.innerHTML = '';

                // Create response div
                const responseDiv = document.createElement('div');
                responseDiv.className = 'text-gray-700';
                responseDiv.textContent = text;
                chatContainer.appendChild(responseDiv);
            }
        });
    </script>
</body>
</html>`
	);
};

// This method is called when your extension is deactivated
export function deactivate() {}
