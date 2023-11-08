import validateDirectory from './validateDirectory.js';

const validateFlags = (flags) => {
  const validFlags = ['-f', '-s', '-x', '-d', '-y', '-n', '-o'];
  return flags.every(flag => validFlags.includes(flag));
}

export default async (message, prefixDir, readline, mustExist=false, flags=[]) => {
  let dir;
  let newFlags;
  let validDir = false;

  while (!validDir) {
    let input = await new Promise(resolve => readline.question(message +' '+prefixDir, resolve));
    let splitInput = input.split(' ');

    if (splitInput.length > 1) {
      [dir, ...newFlags] = splitInput;
      if (!validateFlags(newFlags)) {
        console.log('Invalid flag. Please enter -f, -s, or -x.');
        continue;
      }
      flags = [...flags, ...newFlags];
    } else { 
      dir = splitInput[0];
    }

    if (mustExist && !validateDirectory(prefixDir, dir) && dir.trim() !== '') {
      console.log('Directory does not exist. Please try again.');
    } else {
      validDir = true;
    }
  }

  return [dir, flags];
};