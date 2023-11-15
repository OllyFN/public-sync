import fs from "fs-extra";
import rl from "readline";
import chalk from "chalk";
import clear from "clear";
import path from "path";
import askExcludeDirs from "./askExcludeDirs.js";
import askDirectory from "./askDirectory.js";

const readline = rl.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const directoryConfirmed = (dirPrefix, dir) =>
  console.log(
    chalk.green(
      "Directory confirmed: " + path.resolve(dirPrefix, dir).replace(/\\/g, "/")
    )
  );

export default async (config) => {
  const DEFAULT_EXCLUDE = config.excludeDirs.map((item) => [
    new RegExp(item[0]),
    item[1],
  ]);
  const PUBLIC_DIR =
    config.publicDir[-1] == "/" ? config.publicDir : config.publicDir + "/";
  const PRIVATE_DIR =
    config.privateDir[-1] == "/" ? config.privateDir : config.privateDir + "/";
  const askPublic = "Enter public directory: (will be created if doesnt exist)";
  const askPrivate = "Enter private directory:";
  clear();
  // console.log(chalk.green('Welcome to the Private to Public Sync tool. 🚀'))
  // console.log(chalk.yellow('DEFAULT FILES TO EXCLUDE: '), chalk.red(DEFAULT_EXCLUDE.map(item => item[1]).join(', ')));
  // console.log(chalk.cyan('-f flag to have the same public directory as the private directory.'))
  // console.log(chalk.cyan('-s flag to skip existing public directory warning.'))
  // console.log(chalk.cyan('-x flag to override default directories to exclude.'))
  // console.log(chalk.cyan('-d flag to skip setting directories to exclude & use default.'))

  // Added code to accept an optional parameter in config (default = false) allDifferent
  let allDifferent = config.allDifferent || false; // Get the value of allDifferent from config or set it to false if undefined
  let multipleDirs = false; // A variable to store whether the user wants multiple directories or not
  let numDirs = 1; // A variable to store the number of directories to add
  if (!allDifferent) {
    // If allDifferent is false or undefined, ask the user if they want multiple directories or not
    let response = await new Promise((resolve) =>
      readline.question(
        chalk.cyan(
          "Do you want to have multiple directories or just a single one?\n"
        ) +
          chalk.green("(y) to have multiple directories\n") +
          chalk.red("(n) to have a single directory\n") +
          chalk.gray(
            "(you can add -y or -n flags to skip input validation with coresponding flag as input.)\n"
          ),
        resolve
      )
    );
    if (response === "y" || response === "-y") {
      // If the user wants multiple directories, set multipleDirs to true and ask for the number of directories to add
      multipleDirs = true;
      numDirs = await new Promise((resolve) =>
        readline.question(
          chalk.cyan("How many directories do you want to add? (2-10)\n"),
          resolve
        )
      );
      numDirs = parseInt(numDirs); // Parse the input as an integer
      if (isNaN(numDirs) || numDirs < 2 || numDirs > 10) {
        // If the input is not a valid number or less than 1, set numDirs to 1 and show a warning message
        numDirs = 2;
        console.log(
          chalk.red("Invalid number of directories. Defaulting to 2.")
        );
      }
    } else if (response === "n" || response === "-n") {
      // If the user does not want multiple directories, set multipleDirs to false and numDirs to 1
      multipleDirs = false;
      numDirs = 1;
    } else {
      // If the user enters an invalid response, set multipleDirs to false and numDirs to 1 and show a warning message
      multipleDirs = false;
      numDirs = 1;
      console.log(
        chalk.red("Invalid response. Defaulting to a single directory.")
      );
    }
  } else {
    // If allDifferent is true, set multipleDirs to true and ask for the number of directories to add
    multipleDirs = true;
    numDirs = await new Promise((resolve) =>
      readline.question(
        chalk.cyan("How many directories do you want to add?\n"),
        resolve
      )
    );
    numDirs = parseInt(numDirs); // Parse the input as an integer
    if (isNaN(numDirs) || numDirs < 1) {
      // If the input is not a valid number or less than 1, set numDirs to 1 and show a warning message
      numDirs = 1;
      console.log(chalk.red("Invalid number of directories. Defaulting to 1."));
    }
  }

  // A loop to iterate over the number of directories to add
  for (let i = 0; i < numDirs; i++) {
    let [privateDir, flags] = await askDirectory(
      askPrivate,
      PRIVATE_DIR,
      readline,
      true
    );
    directoryConfirmed(config.privateDir, privateDir);

    let [publicDir, newFlags] = flags.includes("-f")
      ? [privateDir, flags]
      : await askDirectory(askPublic, PUBLIC_DIR, readline, false, flags);

    flags = [...new Set([...flags, ...newFlags])];

    let validDir = false;
    let overrideDir = false;
    let errOverrideQuestion =
      chalk.cyan(
        "Do you want to copy the files into it?\nThis will overwrite files with the same name but won't delete any existing files.\n"
      ) +
      chalk.green("(y) to paste files into directory\n") +
      chalk.red("(n) to pick different directory\n") +
      chalk.yellow("(o) to replace the directory completely\n") +
      chalk.gray(
        "(you can add -y, -n, -o flags to skip input validation with coresponding flag as input.)\n"
      );
    let errQuestion =
      chalk.red(
        "Public directory: " +
          path.resolve(PUBLIC_DIR, publicDir).replace(/\\/g, "/") +
          " already exists.\n"
      ) + errOverrideQuestion;
    while (!validDir) {
      if (!flags.includes("-s") && fs.existsSync(PUBLIC_DIR + publicDir)) {
        let response;
        if (flags.includes("-y")) {
          response = "y";
        } else if (flags.includes("-n")) {
          console.log(
            chalk.red(
              "Public directory already exists. Please pick a different directory."
            )
          );
          response = "n";
        } else if (flags.includes("-o")) {
          response = "o";
        } else {
          response = await new Promise((resolve) =>
            readline.question(errQuestion, resolve)
          );
        }

        switch (response) {
          case "y":
            validDir = true;
            break;
          case "n":
            [publicDir, newFlags] = await askDirectory(
              askPublic,
              PUBLIC_DIR,
              readline,
              false,
              flags
            );
            flags = [...new Set([...flags, ...newFlags])];
            errQuestion =
              chalk.red(
                "Public directory: " +
                  path.resolve(PUBLIC_DIR, publicDir).replace(/\\/g, "/") +
                  " already exists.\n"
              ) + errOverrideQuestion;
            break;
          case "o":
            overrideDir = true;
            validDir = true;
            break;
          default:
            errQuestion = chalk.red(
              "Invalid response. Please enter y, n, or o.\n"
            );
            break;
        }

        flags = flags.filter(
          (flag) => flag !== "-y" && flag !== "-n" && flag !== "-o"
        );
      } else {
        validDir = true;
      }
    }
    directoryConfirmed(config.publicDir, publicDir);
    let excludeDirs = [];

    if (!flags.includes("-d")) {
      [excludeDirs, newFlags] = await askExcludeDirs(flags, readline);
      flags = [...new Set([...flags, ...newFlags])];
    }
    if (!flags.includes("-x")) {
      excludeDirs = [...excludeDirs, ...DEFAULT_EXCLUDE.map((item) => item[0])];
    }

    if (overrideDir) {
      fs.removeSync(PUBLIC_DIR + publicDir);
      fs.mkdirSync(PUBLIC_DIR + publicDir);
    }

    const sourceDir = path.join(config.privateDir, privateDir);
    const destDir = path.join(config.publicDir, publicDir);
    console.log(`${sourceDir} to ${destDir}`);
    fs.readdirSync(sourceDir).forEach((item) => {
      const itemPath = path.join(sourceDir, item);
      // Skip if the current item is the destination directory
      if (item === destDir.slice(0, -1)) {
        return;
      }
      if (!excludeDirs.some((excludedDir) => excludedDir.test(itemPath))) {
        fs.copySync(itemPath, path.join(destDir, item), {
          filter: (src) => {
            if (
              excludeDirs.some((excludedDir) => excludedDir.test(src)) ||
              src === destDir
            ) {
              return false;
            }
            return true;
          },
        });
      }
    });

    // If allDifferent is false and there are multiple directories, ask the user if they want to repeat
  // the same action for the remaining directories or not
  if (!allDifferent && multipleDirs && i < numDirs - 1) {
    let response = await new Promise((resolve) =>
      readline.question(
        chalk.cyan(
          "Do you want to repeat the same action for the remaining directories?\n"
        ) +
          chalk.green("(y) to repeat the same action\n") +
          chalk.red("(n) to enter different action for each directory\n") +
          chalk.gray(
            "(you can add -y or -n flags to skip input validation with coresponding flag as input.)\n"
          ),
        resolve
      )
    );
    if (response === "y" || response === "-y") {
      // If the user wants to repeat the same action, break the loop and copy the remaining directories
      // with the same source and destination names and the same excludeDirs
      break;
    } else if (response === "n" || response === "-n") {
      // If the user does not want to repeat the same action, continue the loop and ask for the next directory
      continue;
    } else {
      // If the user enters an invalid response, show a warning message and continue the loop
      console.log(chalk.red("Invalid response. Continuing to the next directory."));
      continue;
    }
  }
  }
  readline.close();
}
