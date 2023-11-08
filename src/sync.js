#!/usr/bin/env node
import chalk from 'chalk';
import loadConfig from './config.js';
import copyAllFiles from './auto/copyAllFiles.js';
import createDirs from './utils/createDirs.js';
import interactiveCopy from './interactive/interactiveCopy.js';
import createRegex from './utils/createRegex.js';
const config = loadConfig();

const REGEX_EXCLUDE = 
  config.addExcludes.length==0 ?
  config.excludeDirs.map(item => createRegex(item[0])) :
  [...config.excludeDirs.map(item => createRegex(item[0])),...config.addExcludes.map(item => createRegex(item[0]))];

try {
  createDirs(config);
  if (config && config.interactive) {
    await interactiveCopy(config, REGEX_EXCLUDE)
  }else {
    copyAllFiles(config, REGEX_EXCLUDE);
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