#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import chalk from 'chalk';
import ModelClient, { isUnexpected } from '@azure-rest/ai-inference';
import { AzureKeyCredential } from '@azure/core-auth';

// Initialize environment
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Configuration
const CONFIG = {
  ENV_KEY: 'github_token',
  ENDPOINT: 'https://models.github.ai/inference',
  MODEL: 'openai/gpt-4.1',
  MAX_SCAN_DEPTH: 3,
  IGNORE_DIRS: new Set(['node_modules', '.git', 'dist', 'build', 'coverage', '__pycache__', 'venv']),
  IGNORE_FILES: new Set(['.DS_Store', 'Thumbs.db']),
  SOURCE_EXTS: new Set([
    '.js', '.ts', '.jsx', '.tsx', '.mjs', '.py', '.rb', '.php', 
    '.java', '.go', '.rs', '.c', '.cpp', '.h', '.sh', '.ino'
  ]),
  TEMPLATE_PARAMS: {
    max_tokens: 2000,
    temperature: 0.7
  }
};

// --- Core Functions ---

const getApiToken = () => {
  const args = process.argv.slice(2);
  const cliKeyIndex = args.indexOf('--key');
  if (cliKeyIndex !== -1 && args[cliKeyIndex + 1]) {
    return args[cliKeyIndex + 1];
  }

  const envToken = process.env[CONFIG.ENV_KEY];
  if (envToken) return envToken;

  console.log(chalk.red(`
  ${chalk.bold('API token required!')}
  
  ${chalk.underline('Options:')}
  1. ${chalk.green('Env File:')} Create '.env' with:
     ${CONFIG.ENV_KEY}=your_api_token
  
  2. ${chalk.green('CLI Argument:')} Run with:
     readmegen --key your_api_token
  `));
  process.exit(1);
};

const readPackageJson = () => {
  try {
    return JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  } catch {
    return {
      name: path.basename(process.cwd()),
      version: '0.1.0',
      description: ''
    };
  }
};

const scanDirectory = (dirPath = process.cwd(), depth = 0) => {
  if (depth > CONFIG.MAX_SCAN_DEPTH) return [];

  try {
    return fs.readdirSync(dirPath, { withFileTypes: true })
      .filter(dirent => !CONFIG.IGNORE_DIRS.has(dirent.name))
      .map(dirent => {
        const fullPath = path.join(dirPath, dirent.name);
        const relativePath = path.relative(process.cwd(), fullPath);

        if (dirent.isDirectory()) {
          return {
            type: 'directory',
            name: dirent.name,
            path: relativePath,
            contents: scanDirectory(fullPath, depth + 1)
          };
        } else if (dirent.isFile() && CONFIG.SOURCE_EXTS.has(path.extname(dirent.name))) {
          return {
            type: 'file',
            name: dirent.name,
            path: relativePath,
            ext: path.extname(dirent.name)
          };
        }
        return null;
      })
      .filter(Boolean);
  } catch (error) {
    console.log(chalk.yellow(`⚠ Could not scan directory: ${dirPath}`));
    return [];
  }
};

const detectProjectType = (structure) => {
  const extensions = new Set();
  structure.forEach(item => {
    if (item.type === 'file') extensions.add(item.ext);
    if (item.type === 'directory') item.contents.forEach(file => extensions.add(file.ext));
  });

  return {
    isNode: extensions.has('.js') || extensions.has('.mjs'),
    isPython: extensions.has('.py'),
    isRust: extensions.has('.rs'),
    isCLI: structure.some(item => 
      item.name === 'cli.js' || 
      item.name === 'main.py' ||
      item.path.includes('bin/')
    )
  };
};

const generatePrompt = (analysis) => {
  const { metadata, structure } = analysis;
  const { isNode, isPython, isRust, isCLI } = metadata.type;

  return `
Generate a professional README.md for this ${isNode ? 'Node.js' : isPython ? 'Python' : isRust ? 'Rust' : 'Software'} project.

# Project Metadata
- Name: ${metadata.name}
- Version: ${metadata.version}
- Description: ${metadata.description || 'No description provided'}

# Detected Structure
${structure.map(item => 
  item.type === 'directory' ? 
    `📂 ${item.path}/ (${item.contents.length} files)` :
    `📄 ${item.path}`
).join('\n')}

# Required Sections
1. Project Title with badges
2. Description (expand on features)
3. ${isNode ? 'npm Installation' : isPython ? 'pip Installation' : 'Installation'}
4. Usage Examples
5. ${isCLI ? 'Command Reference' : 'API Reference'}
6. Configuration
7. Contributing Guidelines
8. License

Format using GitHub Flavored Markdown with:
- Proper headings hierarchy
- Code blocks for examples
- Tables for CLI commands if applicable
- Badges for version, license, etc.
`;
};

// --- Main Execution ---
(async () => {
  try {
    console.log(chalk.cyan('Analyzing project...'));
    
    const apiToken = getApiToken();
    const pkg = readPackageJson();
    const structure = scanDirectory();
    const projectType = detectProjectType(structure);

    const analysis = {
      metadata: {
        ...pkg,
        type: projectType
      },
      structure
    };

    console.log(chalk.cyan('📄 Generating README...'));
    const client = ModelClient(CONFIG.ENDPOINT, new AzureKeyCredential(apiToken));
    
    const response = await client.path('/chat/completions').post({
      body: {
        messages: [
          { 
            role: 'system', 
            content: 'You are a senior developer that creates perfect READMEs by analyzing project structure. Be concise but thorough.' 
          },
          { 
            role: 'user', 
            content: generatePrompt(analysis) 
          }
        ],
        model: CONFIG.MODEL,
        ...CONFIG.TEMPLATE_PARAMS
      }
    });

    if (isUnexpected(response)) {
      throw new Error(response.body.error?.message || 'API request failed');
    }

    const readmeContent = response.body.choices[0].message.content;
    fs.writeFileSync('README.md', readmeContent.trim());
    
    console.log(chalk.green('✔ README.md generated successfully!'));
    console.log(chalk.blue('Detected:'), 
      Object.entries(projectType)
        .filter(([_, value]) => value)
        .map(([key]) => key.replace('is', ''))
        .join(', ') || 'Unknown project type');
  } catch (error) {
    console.error(chalk.red('✖ Error:'), error.message);
    process.exit(1);
  }
})();