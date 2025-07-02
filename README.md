<div align="center">
  <h1 align="center" style="font-size: 2.5em; margin-bottom: 0.5em;">
    <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
    <br>READMEBOT
  </h1>
  <div align="center" style="margin: 1.5em 0;">
    <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black" alt="JavaScript" />
    <img src="https://img.shields.io/github/license/Dev-Satish-02/readmebot?style=for-the-badge&color=blue" alt="License" />
    <img src="https://img.shields.io/github/last-commit/Dev-Satish-02/readmebot?style=for-the-badge" alt="Last Commit" />
    <img src="https://img.shields.io/npm/v/readmebot?style=for-the-badge" alt="npm version" />
  </div>
</div>


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