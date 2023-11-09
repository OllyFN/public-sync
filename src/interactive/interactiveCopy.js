import fs from 'fs-extra';
import rl from 'readline';
import chalk from 'chalk';
import clear from 'clear';
import path from 'path';
import askExcludeDirs from './askExcludeDirs.js';
import askDirectory from './askDirectory.js';
import validateDirectory from './validateDirectory.js';

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout
});

const directoryConfirmed = (dirPrefix, dir) =>
  console.log(chalk.green('Directory confirmed: ' + path.resolve(dirPrefix, dir).replace(/\\/g, '/')));



export default async (config) => {
  const DEFAULT_EXCLUDE = config.excludeDirs.map(item => [new RegExp(item[0]), item[1]]);
  const PUBLIC_DIR = config.publicDir;
  const PRIVATE_DIR = config.privateDir;
  const askPublic = 'Enter public directory: (will be created if doesnt exist)'
  const askPrivate = 'Enter private directory:'
  clear();
  console.log(chalk.green('Welcome to the Private to Public Sync tool. 🚀'))
  console.log(chalk.yellow('DEFAULT FILES TO EXCLUDE: '), chalk.red(DEFAULT_EXCLUDE.map(item => item[1]).join(', ')));
  console.log(chalk.cyan('-f flag to have the same public directory as the private directory.'))
  console.log(chalk.cyan('-s flag to skip existing public directory warning.'))
  console.log(chalk.cyan('-x flag to override default directories to exclude.'))
  console.log(chalk.cyan('-d flag to skip setting directories to exclude & use default.'))

  let [privateDir, flags] = await askDirectory(askPrivate, PRIVATE_DIR, readline, true);
  directoryConfirmed(config.privateDir, privateDir)

  let [publicDir, newFlags] = flags.includes('-f') ? [privateDir, flags] : await askDirectory(askPublic,PUBLIC_DIR, readline, false, flags);

  flags = [...new Set([...flags, ...newFlags])];

  let validDir = false;
  let overrideDir = false;
  let errOverrideQuestion =
  chalk.cyan('Do you want to copy the files into it?\nThis will overwrite files with the same name but won\'t delete any existing files.\n') +
  chalk.green('(y) to paste files into directory\n') +
  chalk.red('(n) to pick different directory\n') +
  chalk.yellow('(o) to replace the directory completely\n') +
  chalk.gray('(you can add -y, -n, -o flags to skip input validation with coresponding flag as input.)\n')
  let errQuestion=chalk.red('Public directory: ' + path.resolve(PUBLIC_DIR, publicDir).replace(/\\/g, '/') + ' already exists.\n') + errOverrideQuestion;

  while (!validDir) {
    if (!flags.includes('-s') && !validateDirectory(PUBLIC_DIR, publicDir)) {
      let response;
      if (flags.includes('-y')) {
        response='y'
      } else if (flags.includes('-n')) {
        console.log(chalk.red('Public directory already exists. Please pick a different directory.'))
        response='n'
      }else if (flags.includes('-o')) {
        response='o'
      }else {
        response = await new Promise(resolve => readline.question(errQuestion, resolve));
        
      }

      switch (response) {
        case 'y':
          validDir = true;
          break;
        case 'n':
          [publicDir, newFlags] = await askDirectory(askPublic,PUBLIC_DIR, readline, false, flags);
          flags = [...new Set([...flags, ...newFlags])];
          errQuestion = chalk.red('Public directory: ' + path.resolve(PUBLIC_DIR, publicDir).replace(/\\/g, '/') + ' already exists.\n') + errOverrideQuestion;
          break;
        case 'o':
          overrideDir = true;
          validDir = true;
          break;
        default:
          errQuestion=chalk.red('Invalid response. Please enter y, n, or o.\n');
          break;
      }

      flags = flags.filter(flag => flag !== '-y' && flag !== '-n' && flag !== '-o')
    } else {
      validDir = true;
    }
  }
  directoryConfirmed(config.publicDir, publicDir)
  let excludeDirs = []

  if (!flags.includes('-d')) {
    [excludeDirs, newFlags] = await askExcludeDirs(flags, readline);
    flags = [...new Set([...flags, ...newFlags])];
  }
  if (!flags.includes('-x')) {
    excludeDirs = [...excludeDirs, ...DEFAULT_EXCLUDE.map(item => item[0])]
  }

  if (overrideDir) {
    fs.removeSync(PUBLIC_DIR + publicDir);
    fs.mkdirSync(PUBLIC_DIR + publicDir);
  }

  const sourceDir = path.join(config.privateDir, privateDir);
  const destDir = path.join(config.publicDir, publicDir);
  console.log(`${sourceDir} to ${destDir}`)
  fs.readdirSync(sourceDir).forEach(item => {
    const itemPath = path.join(sourceDir, item);
    // Skip if the current item is the destination directory
    if (item === destDir.slice(0, -1)) {
      return;
    }
    if (!excludeDirs.some(excludedDir => excludedDir.test(itemPath))) {
      fs.copySync(itemPath, path.join(destDir, item), {
        filter: (src) => {
          if (excludeDirs.some(excludedDir => excludedDir.test(src)) || src === destDir) {
            return false;
          }
          return true;
        }
      });
    }
  });

  readline.close();
}