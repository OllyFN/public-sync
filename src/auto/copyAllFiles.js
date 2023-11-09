import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export default (config) => {
  const copiedFiles = [];
  const DEFAULT_EXCLUDE = config.excludeDirs.map(item => new RegExp(item[0]));

  let logFn;
  if (config.debug.showCopied && config.debug.showNotCopied) {
    logFn = (src, shouldCopy) => console.log(`${shouldCopy ? 'Copied' : 'Not copied'}: ${src}`);
  } else if (config.debug.showCopied) {
    logFn = (src, shouldCopy) => { if (shouldCopy) console.log(`Copied: ${src}`); };
  } else if (config.debug.showNotCopied) {
    logFn = (src, shouldCopy) => { if (!shouldCopy) console.log(`Not copied: ${src}`); };
  } else {
    logFn = () => {};
  }

  // Remove the destination directory before copying
  fs.removeSync(config.publicDir);
  
  try {
    console.log(chalk.yellow('Starting to copy files...'));
    fs.readdirSync(config.privateDir).forEach(dir => {
      const dirPath = path.join(config.privateDir, dir);
      // Skip if the current dir is the destination directory
      if (dir === dirPath) {
        return;
      }
      if (!DEFAULT_EXCLUDE.some(excludedDir => excludedDir.test(dirPath))) {
        fs.copySync(dirPath, path.join(config.publicDir, dir), {
          filter: (src) => {
            if (DEFAULT_EXCLUDE.some(excludedDir => excludedDir.test(src)) || src === config.publicDir) {
              logFn(src, false);
              return false;
            }
            logFn(src, true);
            copiedFiles.push(path.relative(config.privateDir, src));
            return true;
          }
        });
      }
    });
    console.log(chalk.green(`Copied files: ${copiedFiles.join(', ')}\nTo: ${config.publicDir}`));
  } catch (error) {
    console.error(chalk.red('Error copying files: ' + error));
    throw error;
  }
}