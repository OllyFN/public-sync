#!/usr/bin/env node
import chalk from 'chalk';
import loadConfig from './config.js';
import copyAllFiles from './auto/copyAllFiles.js';
import createDirs from './utils/createDirs.js';
import interactiveCopy from './interactive/interactiveCopy.js';
const config = loadConfig();

try {
  await createDirs(config);
  if (config && config.interactive) {
    await interactiveCopy(config)
  }else {
    copyAllFiles(config);
  }
  console.log(chalk.green('Files copied successfully. ✅'));
  process.exit()
}catch(error) {
  console.log(chalk.red('Error copying files. ❌'));
  if (error.code === 'ENOENT') {
    console.error(chalk.red('A required file or directory was not found. Please check your input and try again.'));
  } else {
    console.error(chalk.red(error));
  }
  process.exit()
}