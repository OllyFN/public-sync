import fs from 'fs-extra';
import chalk from 'chalk';

const validateDir = (dir, dirName) => {
  if (typeof dir !== 'string') {
    throw new TypeError(`${dirName} must be a string`);
  }
  if (/[\0<>:"|?*]/.test(dir)) {
    throw new Error(`${dirName} contains invalid characters`);
  }
  return dir;
}

const createDirIfNotExists = (dir) => {
  console.log(`CHECK ${dir} ${fs.existsSync(dir)}`)
  if (!fs.existsSync(dir)) {
    console.log('CREATING DIR')
    fs.mkdirSync(dir);
    return dir;
  }
  return null;
}

export default (config) => {
  let dirs = [];
  const publicDir = config?.publicDir ? validateDir(config.publicDir, 'publicDir') : './';
  const privateDir = config?.privateDir ? validateDir(config.privateDir, 'privateDir') : './';

  const createdPublicDir = createDirIfNotExists(publicDir);
  const createdPrivateDir = createDirIfNotExists(privateDir);

  if (createdPublicDir) dirs.push(createdPublicDir);
  if (createdPrivateDir) dirs.push(createdPrivateDir);

  if (dirs.length > 0) {
    console.log(chalk.gray(`(Directory ${dirs.join(' & ')} created)`));
  }
};