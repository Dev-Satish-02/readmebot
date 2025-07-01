<!--
<meta property="og:title" content="readmebot - AI README Generator">
<meta property="og:description" content="Automatically generate beautiful README for Node.js/Python/React projects">
<meta property="og:url" content="https://github.com/Dev-Satish-02/readmebot">
-->

# readmebot

Generate professional, AI-powered README files for your projects.

---

## Description

**readmebot** streamlines the process of creating high-quality README.md files by leveraging AI to analyze your project structure and metadata. It quickly produces well-structured, comprehensive documentation, saving you time and ensuring your projects look polished and professional.

### Features

- **AI-Powered Analysis:** Automatically inspects your project's files and metadata.
- **Customizable Output:** Tailors generated READMEs according to your needs.
- **Instant Documentation:** Produces ready-to-use Markdown, formatted for GitHub.
- **Easy Integration:** Simple CLI interface for rapid usage.

---

## Installation

Install **readmebot** globally using npm:

```bash
npm install -g readmebot
```

Or add it as a dev dependency in your project:

```bash
npm install --save-dev readmebot
```

---

## Usage Examples

After installation, you can use **readmebot** from the command line if .env file contains github_token:

```bash
readmebot
```

You can use **readmebot** from the command line by using your own github_token:

```bash
readmebot --key API_KEY
```

Please obtain github_token for openai/gpt-4.1 from here: [token](https://github.com/marketplace/models/azure-openai/gpt-4-1/playground)

### CLI Commands

| Command / Option         | Description                                 |
|--------------------------|---------------------------------------------|
| `readmebot`              | Generate README.md in the current directory |
| `readmebot --key API_KEY`| Generate README.md for the specified path   |

---

## License

This project is licensed under the [MIT License](LICENSE).

---


**readmebot** © 2024. All rights reserved.