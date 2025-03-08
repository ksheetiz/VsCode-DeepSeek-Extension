# DeepSeek ML VSCode Extension

## Overview
The DeepSeek ML VSCode Extension allows users to seamlessly run and manage DeepSeek ML models locally within the VSCode environment. This extension simplifies the setup process and provides intuitive controls for running, debugging, and monitoring ML models.

## Features
- **Easy Setup:** Quickly configure DeepSeek ML models without complex installations.
- **Model Execution:** Run DeepSeek ML models directly from the VSCode terminal.
- **Live Monitoring:** Track model performance and resource utilization in real time.
- **Debugging Tools:** Integrated logging and debugging features to streamline development.
- **Custom Configuration:** Modify model parameters and runtime settings directly from the extension.

## Installation
1. Open VSCode and navigate to the Extensions Marketplace.
2. Search for "DeepSeek ML".
3. Click "Install" to add the extension to your VSCode setup.
4. Restart VSCode to ensure all changes take effect.

## Usage
1. Open your VSCode workspace where your DeepSeek ML model is located.
2. Navigate to the **DeepSeek ML** panel in the activity bar.
3. Click **Start Model** to run the ML model locally.
4. Use the integrated terminal for logs and debugging information.
5. Adjust settings using the configuration panel as needed.

## Configuration
Modify the settings in `.deepseekml-config.json` to customize model execution. Example:
```json
{
  "modelPath": "./models/deepseek-model",
  "gpuEnabled": true,
  "batchSize": 8,
  "loggingLevel": "verbose"
}
```

## Troubleshooting
- **Model Not Starting?** Ensure that all dependencies are installed and the correct model path is set.
- **Performance Issues?** Adjust batch size or disable GPU usage if needed.
- **Logging Issues?** Check the logs in the VSCode terminal and adjust the logging level in the config file.

## Contributing
I welcome contributions! Feel free to submit issues, feature requests, or pull requests on GitHub repo.

## License
This project is licensed under the MIT License. See `LICENSE` for more details.
