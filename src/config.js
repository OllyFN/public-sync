import fs from "fs";
import path from "path";
import chalk from "chalk";
import excludeDirs from "./utils/excludeDirs.js";

const defaultConfig = {
  debug: {
    showCopied: false,
    showNotCopied: false,
  },
  publicDir: "./publicSync/",
  privateDir: "./",
  excludeDirs: excludeDirs,
  addExcludes: [],
  interactive: false,
  override: true,
};

function loadConfig() {
  try {
    const packageJson = JSON.parse(
      fs.readFileSync(path.resolve(process.cwd(), "package.json"), "utf8")
    );
    if (packageJson.publicSync) {
      return { ...defaultConfig, ...packageJson.publicSync };
    } else {
      throw new Error("publicSync not found in package.json");
    }
  } catch {
    console.log(
      chalk.gray(
        "Using default config. (use publicSyncConfig in package.json to change config)"
      ) + "\n"
    );
    return defaultConfig;
  }
}

export default loadConfig;
