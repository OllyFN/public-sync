import createRegex from "../createRegex.js";
import chalk from 'chalk';


const addDirToExclusions = (dir, dirs) => {
  if (dir && dir.trim() !== '-f') {
    console.log(dir)
    try {
      dirs.push(createRegex(dir));
    } catch (error) {
      console.error(chalk.red('Invalid regular expression: ' + dir));
      return false;
    }
  }
  return true;
}

export default async (flags, readline) => {
  let dirs = [];
  let newFlags=[]
  let dir;

  do {
    const input = await new Promise(resolve => readline.question('Exclude regex expression (leave empty to continue):', resolve));
    const splitInput=input.split(' ')
    if (splitInput.length==0) {
      continue;
    } else if (splitInput.length==1) {
      dir=splitInput[0]
    } else {
      [dir, ...newFlags]=splitInput
      flags = [...flags, ...newFlags];
    }

    if (dir && dir.trim() !== '-f') {
      try {
        dirs.push(createRegex(dir));
      } catch (error) {
        console.error(chalk.red('Invalid regular expression: ' + dir));
      }
    }

  } while (dir.trim().length!==0 && dir !== '-f' && !newFlags.includes('-f'));
  return [dirs, flags];
};