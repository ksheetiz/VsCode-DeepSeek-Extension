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
            .page { display: none; }
            .active { display: block; }
        </style>
    </head>
    <body class="p-4 flex flex-col items-center justify-center min-h-screen">
        <div class="w-full max-w-2xl bg-white shadow-md rounded-lg p-6">
            <!-- Page 1: Option Selection -->
            <div id="selectionPage" class="page active text-center">
                <h2 class="text-2xl font-bold mb-6 text-gray-800">Select Your Assistant Type</h2>
                
                <select 
                    id="assistantTypeSelect" 
                    class="w-full p-3 border rounded-lg mb-4 focus:outline-none focus:border-green-500"
                >
                    <option value="">Choose Assistant Type</option>
                </select>

                <button 
                    id="nextBtn" 
                    class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                >
                    Next
                </button>
            </div>

            <!-- Page 2: Chat Interface -->
            <div id="chatPage" class="page">
                <h2 id="assistantTitle" class="text-2xl font-bold mb-4 text-center text-gray-800">
                    Assistant
                </h2>
                
                <textarea 
                    id="prompt" 
                    rows="3" 
                    placeholder="Ask something . . ." 
                    class="w-full p-3 border rounded-lg mb-4 focus:outline-none"
                ></textarea>
                
                <div class="flex justify-center mb-4">
                    <button 
                        id="askBtn" 
                        class="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                    >
                        Ask
                    </button>
                    <button 
                        id="backBtn" 
                        class="px-6 py-2 ml-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                        Back
                    </button>
                </div>
                
                <div 
                    id="response" 
                    class="border border-gray-200 rounded-lg p-4 bg-gray-50 min-h-[200px]"
                >
                    <!-- Response will be dynamically inserted here -->
                </div>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            const selectionPage = document.getElementById('selectionPage');
            const chatPage = document.getElementById('chatPage');
            const chatContainer = document.getElementById('response');
            const promptTextarea = document.getElementById('prompt');
            const assistantTypeSelect = document.getElementById('assistantTypeSelect');
            const nextBtn = document.getElementById('nextBtn');
            const assistantTitle = document.getElementById('assistantTitle');

            let selectedOption = '';

            // Next Button Handling
            nextBtn.addEventListener('click', () => {
                selectedOption = assistantTypeSelect.value;
                if (!selectedOption) {
                    alert('Please select an assistant type');
                    return;
                }
                assistantTitle.textContent = assistantTypeSelect.options[assistantTypeSelect.selectedIndex].text;
                vscode.postMessage({
                    command: 'modelSelect', 
                    text: selectedOption
                })
                selectionPage.classList.remove('active');
                chatPage.classList.add('active');
            });

            // Back Button
            document.getElementById('backBtn').addEventListener('click', () => {
                chatPage.classList.remove('active');
                selectionPage.classList.add('active');
            });

            // Ask Button
            document.getElementById('askBtn').addEventListener('click', () => {
                const text = promptTextarea.value;
                if (text.trim() === '') return;

                chatContainer.innerHTML = '';

                const loadingDiv = document.createElement('div');
                loadingDiv.className = 'text-center text-gray-500 animate-pulse';
                loadingDiv.textContent = 'Thinking...';
                chatContainer.appendChild(loadingDiv);

                vscode.postMessage({
                    command: 'chat', 
                    text: text,
                    assistantType: selectedOption
                });
                
                promptTextarea.value = '';
            });

            // Message Handling
            window.addEventListener('message', event => {
                const {command} = event.data;
                if(command === "chatResponse"){
                    const {text} = event.data;
                    chatContainer.innerHTML = '';
                    const responseDiv = document.createElement('div');
                    responseDiv.className = 'text-gray-700';
                    responseDiv.textContent = text;
                    chatContainer.appendChild(responseDiv);
                }

				if(command === "modelList"){
                    const {text, value} = event.data;
					const selectElement = document.getElementById('assistantTypeSelect');
                    const optionEle = document.createElement('option');
					optionEle.value = value;
					optionEle.textContent = text;
					selectElement.appendChild(optionEle)
				}
            });
        </script>
    </body>
    </html>`
	);
};

export default getWebviewContent;