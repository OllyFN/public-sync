import fs from "fs-extra";
import path from "path";
import chalk from "chalk";

export default (config) => {
  const copiedFiles = [];
  const DEFAULT_EXCLUDE = config.excludeDirs.map((item) => new RegExp(item[0]));
  const OVERRIDE_EXCEPTIONS = config.overrideExceptions.map(
    (item) => new RegExp(item)
  );

  let logFn;
  if (config.debug.showCopied && config.debug.showNotCopied) {
    logFn = (src, shouldCopy) =>
      console.log(`${shouldCopy ? "Copied" : "Not copied"}: ${src}`);
  } else if (config.debug.showCopied) {
    logFn = (src, shouldCopy) => {
      if (shouldCopy) console.log(`Copied: ${src}`);
    };
  } else if (config.debug.showNotCopied) {
    logFn = (src, shouldCopy) => {
      if (!shouldCopy) console.log(`Not copied: ${src}`);
    };
  } else {
    logFn = () => {};
  }

  function removeUnmatchedFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    if (
      OVERRIDE_EXCEPTIONS.some((pattern) => pattern.test(path.basename(dir)))
    ) {
      return true;
    }

    let hasMatch = false;
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (removeUnmatchedFiles(fullPath)) {
          hasMatch = true;
        } else {
          fs.removeSync(fullPath);
        }
      } else if (entry.isFile()) {
        if (OVERRIDE_EXCEPTIONS.some((pattern) => pattern.test(entry.name))) {
          hasMatch = true;
        } else {
          fs.removeSync(fullPath);
        }
      }
    }

    return hasMatch;
  }

  if (config.override) {
    if (OVERRIDE_EXCEPTIONS.length > 0) {
      removeUnmatchedFiles(config.publicDir);
    } else {
      fs.removeSync(config.publicDir);
      fs.mkdirSync(config.publicDir, { recursive: true });
    }
  }

  try {
    console.log(chalk.yellow("Starting to copy files..."));
    const publicDirName = path.basename(config.publicDir);

    // Check the type of config.privateDir
    if (typeof config.privateDir === "string") {
      // Single directory
      const privateDirPath = path.dirname(config.privateDir);
      fs.readdirSync(config.privateDir).forEach((dir) => {
        const dirPath = path.join(config.privateDir, dir);
        if (dir === publicDirName) {
          return;
        }
        if (!DEFAULT_EXCLUDE.some((excludedDir) => excludedDir.test(dirPath))) {
          fs.copySync(dirPath, path.join(config.publicDir, dir), {
            filter: (src) => {
              if (
                DEFAULT_EXCLUDE.some((excludedDir) => excludedDir.test(src)) ||
                src === config.publicDir
              ) {
                logFn(src, false);
                return false;
              }
              logFn(src, true);
              copiedFiles.push(path.relative(config.privateDir, src));
              return true;
            },
          });
        }
      });
    } else if (Array.isArray(config.privateDir)) {
      // List of private directories
      config.privateDir.forEach((privateDir) => {
        const privateDirPath = path.dirname(privateDir);
        fs.readdirSync(privateDir).forEach((dir) => {
          const dirPath = path.join(privateDir, dir);
          if (dir === publicDirName) {
            return;
          }
          if (!DEFAULT_EXCLUDE.some((excludedDir) => excludedDir.test(dirPath))) {
            fs.copySync(dirPath, path.join(config.publicDir, dir), {
              filter: (src) => {
                if (
                  DEFAULT_EXCLUDE.some((excludedDir) => excludedDir.test(src)) ||
                  src === config.publicDir
                ) {
                  logFn(src, false);
                  return false;
                }
                logFn(src, true);
                copiedFiles.push(path.relative(privateDir, src));
                return true;
              },
            });
          }
        });
      });
    } else if (Array.isArray(config.privateDir) && typeof config.privateDir[0] === "object") {
      // List of dictionaries
      config.privateDir.forEach((privateDir) => {
        const privateDirPath = path.dirname(Object.keys(privateDir)[0]);
        fs.readdirSync(Object.keys(privateDir)[0]).forEach((dir) => {
          const dirPath = path.join(Object.keys(privateDir)[0], dir);
          if (dir === publicDirName) {
            return;
          }
          if (!DEFAULT_EXCLUDE.some((excludedDir) => excludedDir.test(dirPath))) {
            fs.copySync(dirPath, path.join(config.publicDir, dir), {
              filter: (src) => {
                if (
                  DEFAULT_EXCLUDE.some((excludedDir) => excludedDir.test(src)) ||
                  src === config.publicDir
                ) {
                  logFn(src, false);
                  return false;
                }
                logFn(src, true);
                copiedFiles.push(path.relative(privateDirPath, src));
                return true;
              },
            });
          }
        });
      });
    }

    console.log(
      chalk.green(
        `Copied files: ${copiedFiles.join(", ")}\nTo: ${config.publicDir}`
      )
    );
  } catch (error) {
    console.error(chalk.red("Error copying files: " + error));
    throw error;
  }
};
