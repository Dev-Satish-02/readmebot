# readmebot

Generate professional, AI-powered README files for your Node.js projects.

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

After installation, you can use **readmebot** from the command line:

```bash
readmebot
```

Generate a README.md for your current directory:

```bash
readmebot
```

Specify a target directory:

```bash
readmebot ./my-project
```

Customize output filename:

```bash
readmebot --output CUSTOM_README.md
```

### CLI Commands

| Command / Option        | Description                                 |
|------------------------|---------------------------------------------|
| `readmebot`            | Generate README.md in the current directory |
| `readmebot <path>`     | Generate README.md for the specified path   |
| `--output <filename>`  | Specify custom output filename              |
| `--help`               | Show help and usage information             |

---

## API Reference

If using **readmebot** programmatically:

```js
const readmebot = require('readmebot');

readmebot.generate({
  path: './my-project',
  output: 'README.md'
});
```

#### Methods

| Method         | Parameters                   | Description                                  |
|----------------|-----------------------------|----------------------------------------------|
| `generate`     | `{ path, output }`          | Generates README for a directory             |

- **path**: *string* - Directory to analyze. Defaults to current directory.
- **output**: *string* - Output filename. Defaults to `README.md`.

---

## Configuration

**readmebot** works out-of-the-box, but you can provide a config file (`readmebot.config.js` or `.readmebotrc`) in your project root to customize:

```js
module.exports = {
  title: "My Custom Project Title",
  sections: ["Description", "Installation", "Usage", "API Reference", "License"],
  output: "CUSTOM_README.md"
};
```

#### Supported Options

| Option      | Type     | Description                                  |
|-------------|----------|----------------------------------------------|
| `title`     | string   | Custom project title                         |
| `sections`  | array    | Sections to include in the README            |
| `output`    | string   | Output filename for the generated README     |

---

## Contributing Guidelines

We welcome contributions! To get started:

1. Fork this repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

Please follow the [Contributor Covenant](https://www.contributor-covenant.org/) code of conduct.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

**readmebot** © 2024. All rights reserved.