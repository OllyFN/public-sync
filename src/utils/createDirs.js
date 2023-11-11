import fs from "fs-extra";
import chalk from "chalk";

const validateDir = (dir, dirName) => {
  if (typeof dir !== "string") {
    throw new Error(`${dirName} must be a string`);
  }
  if (dir.trim().length === 0) {
    throw new Error(`${dirName} cannot be empty`);
  }
  if (/[\0<>:"|?*]/.test(dir)) {
    throw new Error(`${dirName} contains invalid characters`);
  }
  return dir[-1] === "/" ? dir : dir + "/";
};

const handleDirCreation = (dir, dirs) =>
  !fs.existsSync(dir) &&
  dirs.push(dir) &&
  fs.mkdirSync(dir, { recursive: true });

export default async (config) => {
  const publicDir = validateDir(config.publicDir, "publicDir");
  const privateDir = validateDir(config.privateDir, "privateDir");
  console.log(`public: ${publicDir} private: ${privateDir}`);

  if (publicDir == privateDir) {
    throw new Error("publicDir and privateDir cannot be the same");
  }
  if (publicDir == "./") {
    throw new Error("publicDir cannot be the current directory");
  }

  let dirs = [];
  handleDirCreation(publicDir, dirs);
  handleDirCreation(privateDir, dirs);

  if (dirs.length > 0) {
    console.log(chalk.gray(`(Directory ${dirs.join(" & ")} created)`));
  }
};
