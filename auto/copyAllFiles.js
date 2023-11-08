import fs from 'fs-extra';
import path from 'path';
import chalk from 'chalk';

export default (config, excludeDirs) => {
  const copiedFiles = [];
  const directoriesToCopy = fs.readdirSync(config.privateDir).filter(dir => dir !== path.basename(config.publicDir));

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
    directoriesToCopy.forEach((dir) => {
      fs.copySync(path.join(config.privateDir, dir), path.join(config.publicDir, dir), {
        filter: (src) => {
          for (let excludedDir of excludeDirs) {
            if (excludedDir.test(src)) {
              logFn(src, false);
              return false;
            }
          }
          logFn(src, true);
          copiedFiles.push(path.relative(config.privateDir, src));
          return true;
        }
      });
    });
    console.log(chalk.green(`Copied files: ${copiedFiles.join(', ')}\nTo: ${config.publicDir}`));
  } catch (error) {
    console.error(chalk.red('Error copying files: ' + error));
  }
}