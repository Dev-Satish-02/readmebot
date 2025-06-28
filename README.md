# readmebot

Generate professional README.md files for your projects using AI.

[![npm version](https://img.shields.io/npm/v/readmebot.svg)](https://www.npmjs.com/package/readmebot)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)
[![Issues](https://img.shields.io/github/issues/Dev-Satish-02/readmebot)](https://github.com/Dev-Satish-02/readmebot/issues)

---

## Description

**readmebot** is a command-line tool that helps you generate high-quality README.md files for your projects using AI. By leveraging Azure AI services, readmebot streamlines the documentation process, ensuring your repositories have clear, concise, and professional READMEs with minimal effort.

---

## Features

- ✨ **AI-powered README generation**  
  Generate professional README.md files tailored to your project.

- ⚡ **Easy-to-use CLI**  
  Generate READMEs directly from your terminal with a single command.

- 🛠️ **Customizable**  
  Fine-tune the generated README to fit your project's unique requirements.

- 🔒 **Environment configuration support**  
  Use `.env` files to securely manage your API keys and configuration.

---

## Installation

To install **readmebot** globally using [npm](https://www.npmjs.com/):

```bash
npm install -g readmebot
```

Or use it as a local project dependency:

```bash
npm install readmebot
```

---

## Usage

After installation, use the `readmebot` command in your terminal:

```bash
readmebot
```

By default, readmebot will prompt you for information about your project and generate a `README.md` file in your current directory.

### Configuration

**readmebot** requires access to Azure AI services. You must provide your Azure API credentials via a `.env` file in your project root:

```env
AZURE_API_KEY=your_azure_api_key
AZURE_ENDPOINT=your_azure_endpoint
```

> **Note:** For detailed setup instructions, refer to the [official documentation](https://github.com/Dev-Satish-02/readmebot#readme) or open an [issue](https://github.com/Dev-Satish-02/readmebot/issues) for support.

---

## Example

```bash
$ readmebot
? Project Name: my-awesome-app
? Description: An app that does awesome things
? Author: Jane Doe
...
README.md generated successfully!
```

---

## License

This project is licensed under the [ISC License](LICENSE).

---

## Contributing

Contributions, issues and feature requests are welcome!  
Feel free to check the [issues page](https://github.com/Dev-Satish-02/readmebot/issues).

---

## Author

Developed by [Dev Satish](https://github.com/Dev-Satish-02).

---

## Links

- [GitHub Repository](https://github.com/Dev-Satish-02/readmebot)
- [Report Issues](https://github.com/Dev-Satish-02/readmebot/issues)
- [NPM Package](https://www.npmjs.com/package/readmebot)

---

> _Generate professional README.md files for your projects in seconds!_