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
    max_tokens: 3000,
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
  const projectName = metadata.name || 'Project';
  const description = metadata.description || 'A well-documented project';
  const repoName = metadata.repository?.url?.split('/').pop()?.replace('.git', '') || 'repository-name';
  const userName = metadata.repository?.url?.split('/').slice(-2, -1)[0] || 'username';

  // Detect all technologies used
  const techStack = detectTechnologies(structure);

  return `
Generate a professional README.md with this exact structure:

<div align="center">
  <h1 align="center" style="font-size: 2.5em; margin-bottom: 0.5em;">
    <img src="https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/ec559a9f6bfd399b82bb44393651661b08aaf7ba/icons/folder-markdown-open.svg" width="100" />
    <br>${projectName.toUpperCase()}
  </h1>
  <h3 align="center" style="font-size: 1.2em; margin-top: 0;">${description}</h3>
  
  <div align="center" style="margin: 1.5em 0;">
    ${techStack.map(tech => {
      const badgeUrl = getTechBadgeUrl(tech);
      return `<img src="${badgeUrl}" alt="${tech}" />`;
    }).join('\n    ')}
  </div>
  
  <div align="center" style="margin: 1.5em 0;">
    <img src="https://img.shields.io/github/license/${userName}/${repoName}?style=for-the-badge&color=blue" alt="License" />
    <img src="https://img.shields.io/github/last-commit/${userName}/${repoName}?style=for-the-badge" alt="Last Commit" />
    <img src="https://img.shields.io/npm/v/${repoName}?style=for-the-badge" alt="npm version" />
  </div>
</div>

# Detected Structure
${generateStructureTree(structure)}

# Required Sections
1. Detected Structure
2. Installation (using npm or pip after cloning the repository)
3. Contributing Guidelines (not compulary)
4. License (if present)

Format using GitHub Flavored Markdown with:
- Proper headings hierarchy
- Code blocks for examples
- Tables for CLI commands if applicable
`;

    function getRepoInfo(pkg) {
    try {
      if (pkg.repository) {
        const repoStr = typeof pkg.repository === 'string' ? pkg.repository : pkg.repository.url;
        const match = repoStr.match(/github\.com[/:]([^/]+)\/([^/]+?)(\.git)?$/);
        if (match) return { user: match[1], repo: match[2] };
      }
    } catch (e) {
      console.log(chalk.yellow('⚠ Could not parse repository URL'));
    }
    return { user: 'username', repo: 'repository' };
  }

  // Helper function to detect all technologies used
  function detectTechnologies(structure) {
    const extensions = new Set();
    const techStack = new Set();

    // Scan all files for extensions
    structure.forEach(item => {
      if (item.type === 'file') extensions.add(item.ext);
      if (item.type === 'directory') {
        item.contents.forEach(file => extensions.add(file.ext));
      }
    });

    // Map extensions to technologies
    const techMap = {
      '.js': 'JavaScript',
      '.ts': 'TypeScript',
      '.jsx': 'React',
      '.tsx': 'TypeScript',
      '.py': 'Python',
      '.rb': 'Ruby',
      '.java': 'Java',
      '.go': 'Go',
      '.rs': 'Rust',
      '.php': 'PHP',
      '.sh': 'Bash'
    };

    extensions.forEach(ext => {
      if (techMap[ext]) techStack.add(techMap[ext]);
    });

    return Array.from(techStack);
  }

  // Helper function to generate badges for all detected technologies
  function getTechBadgeUrl(tech) {
    const badgeMap = {
      'JavaScript': 'https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black',
      'TypeScript': 'https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white',
      'Python': 'https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white',
      'React': 'https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black',
      'Ruby': 'https://img.shields.io/badge/Ruby-CC342D?style=for-the-badge&logo=ruby&logoColor=white',
      'Java': 'https://img.shields.io/badge/Java-007396?style=for-the-badge&logo=java&logoColor=white',
      'Go': 'https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white',
      'Rust': 'https://img.shields.io/badge/Rust-000000?style=for-the-badge&logo=rust&logoColor=white',
      'PHP': 'https://img.shields.io/badge/PHP-777BB4?style=for-the-badge&logo=php&logoColor=white',
      'Bash': 'https://img.shields.io/badge/Bash-4EAA25?style=for-the-badge&logo=gnubash&logoColor=white'
    };
    return badgeMap[tech] || '';
  }


  // Helper function to generate directory tree
  function generateStructureTree(structure, depth = 0, prefix = '') {
    let tree = '';
    const lastIndex = structure.length - 1;
    const indent = depth > 0 ? '│   '.repeat(depth - 1) : '';
    
    structure.forEach((item, index) => {
      const isLast = index === lastIndex;
      const pointer = isLast ? '└── ' : '├── ';
      
      if (item.type === 'directory') {
        tree += `${indent}${prefix}${pointer}📂 ${item.name}/\n`;
        tree += generateStructureTree(
          item.contents, 
          depth + 1, 
          isLast ? '    ' : '│   '
        );
      } else {
        tree += `${indent}${prefix}${pointer}📄 ${item.name}\n`;
      }
    });
    
    return tree;
  }
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