# readmebot

Generate professional project README files using AI!

[![NPM Version](https://img.shields.io/npm/v/readmebot.svg)](https://www.npmjs.com/package/readmebot)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Issues](https://img.shields.io/github/issues/Dev-Satish-02/readmebot.svg)](https://github.com/Dev-Satish-02/readmebot/issues)

---

## Description

**readmebot** is a Node.js CLI tool that leverages the power of AI to generate comprehensive and professional README.md files for your projects. Save time and ensure consistency across your repositories with automated, intelligent documentation.

---

## Features

- 🚀 **AI-Powered README Generation:** Get detailed, well-structured README files tailored to your project.
- ✍️ **Customizable Prompts:** Enhance your documentation by specifying key details.
- 🎨 **Colorful CLI Output:** Friendly and clear command-line interface using Chalk.
- 🔒 **Secure Configuration:** Manage API keys and environment variables with dotenv.
- ☁️ **Azure AI Integration:** Uses Azure AI services for accurate and high-quality content generation.

---

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/Dev-Satish-02/readmebot.git
   cd readmebot
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   - Create a `.env` file in the project root.
   - Add your Azure AI credentials and any other required configuration.
   - Example:
     ```env
     AZURE_API_KEY=your_azure_api_key
     AZURE_ENDPOINT=your_azure_endpoint
     ```

---

## Usage

> **Note:** Ensure you have set up your `.env` file with valid Azure AI credentials.

1. **Run the CLI:**
   ```bash
   node index.js
   ```

2. **Follow the prompts** to provide project details. The AI will generate a complete README.md file based on your input.

3. **View your generated README.md** in the current directory.

---

## Example

```bash
$ node index.js
Welcome to READMEbot!
? What is your project name? awesome-app
? Provide a short description: A CLI tool that does amazing things.
...
🎉 README.md generated successfully!
```

---

## Contributing

Contributions, issues, and feature requests are welcome!  
Feel free to check [issues page](https://github.com/Dev-Satish-02/readmebot/issues) if you want to contribute.

---

## License

This project is licensed under the ISC License.  
See the [LICENSE](LICENSE) file for details.

---

## Author

Developed by [Dev Satish](https://github.com/Dev-Satish-02)

---

## Links

- [GitHub Repository](https://github.com/Dev-Satish-02/readmebot)
- [Issue Tracker](https://github.com/Dev-Satish-02/readmebot/issues)
- [Project Homepage](https://github.com/Dev-Satish-02/readmebot#readme)