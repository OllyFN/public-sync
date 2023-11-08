import fs from 'fs-extra';
import chalk from 'chalk';

export default (config) => {
  let dirs = [];
  let publicDir = './';

  if (config && typeof config.publicDir === 'string') {
      publicDir = config.publicDir;
  } else if (config && typeof config.publicDir !== 'undefined') {
      throw new TypeError('publicDir must be a string');
  }

  if (!fs.existsSync(config.privateDir)) {
      dirs.push(config.privateDir);
      fs.mkdirSync(config.privateDir);
  }

  if (!fs.existsSync(config.publicDir)) {
      dirs.push(config.publicDir);
      fs.mkdirSync(config.publicDir);
  }

  if (dirs.length > 0) {
      console.log(chalk.gray(`(Directory ${dirs.join(' & ')} created)`));
  }
}