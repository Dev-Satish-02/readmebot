#!/usr/bin/env node

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import chalk from "chalk";
import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.github_token;
const endpoint = "https://models.github.ai/inference";
const model = "openai/gpt-4.1";

const pkgPath = path.resolve(process.cwd(), "package.json");

if (!fs.existsSync(pkgPath)) {
  console.log(chalk.red("No package.json found in this directory."));
  process.exit(1);
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf-8"));

const prompt = `
Generate a complete professional README.md file for the following Node.js project. 
Include title, description, install steps, usage, features, and license.

Project metadata:
${JSON.stringify(pkg, null, 2)}
`;

export async function main() {
  console.log(chalk.cyan("Generating README..."));

  const client = ModelClient(endpoint, new AzureKeyCredential(token));

  const response = await client.path("/chat/completions").post({
    body: {
      messages: [
        { role: "system", content: "You are a helpful assistant that writes professional README.md files for developers." },
        { role: "user", content: prompt }
      ],
      temperature: 0.7,
      top_p: 1,
      model: model
    }
  });

  if (isUnexpected(response)) {
    throw response.body.error;
  }

  const readme = response.body.choices[0].message.content;
  fs.writeFileSync("README.md", readme.trim());
  console.log(chalk.green("README.md generated successfully."));
}

main().catch((err) => {
  console.error(chalk.red("Error:"), err);
});
