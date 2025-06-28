#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import chalk from "chalk";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();

// Configuration
const DEFAULT_ENV_KEY = "github_token";
const ENDPOINT = "https://models.github.ai/inference";
const MODEL = "openai/gpt-4.1";
const PKG_PATH = path.resolve(process.cwd(), "package.json");

// Token resolution logic
const getApiToken = () => {
  // 1. Check for --key CLI argument
  const args = process.argv.slice(2);
  const cliKeyIndex = args.indexOf("--key");
  if (cliKeyIndex !== -1 && args[cliKeyIndex + 1]) {
    return args[cliKeyIndex + 1];
  }

  // 2. Check .env file
  const envToken = process.env[DEFAULT_ENV_KEY];
  if (envToken) return envToken;

  // No token found
  console.log(chalk.red(`
  ${chalk.bold("API token required!")}
  
  ${chalk.underline("Options:")}
  1. ${chalk.green("Env File:")} Create '.env' with:
     ${DEFAULT_ENV_KEY}=your_api_token
  
  2. ${chalk.green("CLI Argument:")} Run with:
     readmebot --key your_api_token
  
  ${chalk.yellow("Note:")} Get tokens from GitHub's inference API portal
  `));
  process.exit(1);
};

// Validate package.json exists
const validateProject = () => {
  if (!fs.existsSync(PKG_PATH)) {
    console.log(chalk.red("No package.json found in this directory"));
    process.exit(1);
  }
  return JSON.parse(fs.readFileSync(PKG_PATH, "utf-8"));
};

// Generate README content
const generatePrompt = (pkg) => `
Generate a professional README.md for this project.
Include: Title, Description, Installation, Usage, Features, License.

${chalk.yellow("Project Metadata:")}
${JSON.stringify({
  name: pkg.name,
  description: pkg.description,
  version: pkg.version,
  scripts: pkg.scripts,
  dependencies: Object.keys(pkg.dependencies || {}),
}, null, 2)}
`;

// Main execution
(async () => {
  try {
    console.log(chalk.cyan("Generating README..."));

    const apiToken = getApiToken();
    const pkg = validateProject();

    const client = ModelClient(ENDPOINT, new AzureKeyCredential(apiToken));

    const response = await client.path("/chat/completions").post({
      body: {
        messages: [
          {
            role: "system",
            content: "You are a technical writer creating perfect README.md files with beautiful designs."
          },
          {
            role: "user",
            content: generatePrompt(pkg)
          }
        ],
        model: MODEL,
        temperature: 0.7
      }
    });

    if (isUnexpected(response)) {
      throw new Error(response.body.error?.message || "API request failed");
    }

    const readmeContent = response.body.choices[0].message.content;
    fs.writeFileSync("README.md", readmeContent.trim());

    console.log(chalk.green("README.md generated successfully!"));
  } catch (error) {
    console.error(chalk.red("Error:"), error.message);
    process.exit(1);
  }
})();