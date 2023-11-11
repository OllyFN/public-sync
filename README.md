# public-sync 🔄

`public-sync` is a powerful tool designed to synchronize files from a private directory to a public directory. It's particularly useful when you want to exclude specific directories or files during the copying process, such as sensitive data or unnecessary files.

## Installation 🔧

Install `public-sync` as a development dependency using npm:

```bash
npm install --save-dev public-sync
```

## Template 📄

Check out the [official template](https://github.com/OllyFN/public-sync-template) that I personally use for my projects which explains how to use public-sync effectively and it can be used as an example to understand how to use the tool.

## Configuration ⚙️

Configure `public-sync` by including a "publicSync" section in your package.json. Here's the default configuration with explanations for each option:

```json
"publicSync": {
  "debug": {
    "showCopied": false,
    "showNotCopied": false
  },
  "publicDir": "./publicSync/",
  "privateDir": "./",
  "excludeDirs": "[[Regex expression, readable directory], ...]",
  "addExcludes": [],
  "interactive": false,
  "override": true,
  "overrideExceptions": []
}
```

- `publicDir`: Destination directory for copied files.
- `privateDir`: Source directory for copying files.
- `excludeDirs`: Array of directory patterns to exclude. For example, to exclude all `.git` directories, use `["/*.git/*", ".git/"]`.
- `addExcludes`: Additional exclusions that can be used in combination with `excludeDirs`.
- `interactive`: When true, enables advanced interactive configuration options.
- `override`: When true, deletes all files in `publicDir` that don't match any files in `privateDir`.
- `overrideExceptions`: Array of regex expressions for files or directories that should not be overridden, even when `override` is true.

## Regex expressions 🎭

- `/folder$/` - Targets a specific folder. Example: `/.git$/` to target `.git` folders.
- `/file.txt/` - Targets a specific file. Example: `/apiKeys.txt/` to target a file named `apiKeys.txt`.
- `/*.ext` - Targets all files with a specific extension. Example: `/*.env` to target all `.env` files.
- `/*phrase*` - Targets all files with a phrase in the name. Example: `/*.config.*` to target files like `jest.config.js` or `webpack.config.js`

## Usage 🚀

To use `public-sync`, add a script to your package.json:

```json
"scripts": {
  "sync": "public-sync"
}
```

Then, run the synchronization with `npm run sync`.

## Examples 📚

### Use Case 1: Basic Usage and Directory Exclusion 📝

By default, `public-sync` copies all files from `./` to `./publicSync`, excluding directories specified in `excludeDirs` and `addExcludes`. To exclude additional directories or files, add them to `addExcludes`:

```json
"publicSync": {
  "publicDir": "./public",
  "privateDir": "./private",
  "addExcludes": [["/*apiKeys/*", "Api keys"], ["/*.zip", ".zip"]]
}
```

GitHub Copilot: I apologize for the oversight. Here's the revised version of Use Case 2 and 3:

````markdown
### Use Case 2: Directory Modification and Interactive Features 📁

You can change the source and destination directories. The `interactive` option provides advanced flexibility with flags like `-f` (finish), `-s` (skip warnings), `-x` (customize exclusions), and `-d` (use default exclusions):

```json
"publicSync": {
  "publicDir": "./new_public",
  "privateDir": "./new_private",
  "interactive": true
}
```
````

Then, run the synchronization with interactive flags:

```bash
npm run sync
> Enter private directory: ./ -f -x
> Enter directory to exclude & use the -f flag to finish: /*node_modules/*
> Enter directory to exclude & use the -f flag to finish: /*.git/* -f
```

In this example, the `-f` flag is used to finish the process, and the `-x` flag is used to customize exclusions. The directories `node_modules` and `.git` are excluded from the synchronization.

### Use Case 3: Overriding and Exception Handling 🚦

The `override` option deletes unmatched files in `publicDir`. To keep specific files, directories, or file types, use `overrideExceptions`:

```json
"publicSync": {
  "override": true,
  "overrideExceptions": ["/extra.txt/", "/extra$/", "/*.env"]
}
```

This configuration will keep `extra.txt`, the `extra` directory, and all `.env` files in `publicDir`, even when other files are being overridden.

### Use Case 4: Interactive Mode 💬

Interactive mode allows you to customize the synchronization process on the fly. Here's an example of how to use it:

```bash
npm run sync
> Enter private directory: ./ -f -x
> Enter directory to exclude & use the -f flag to finish: /*node_modules/*
> Enter directory to exclude & use the -f flag to finish: /*.git/* -f
```

In this example, the `-f` flag is used to finish the process, and the `-x` flag is used to customize exclusions. The directories `node_modules` and `.git` are excluded from the synchronization.

## Default `excludeDirs` value 📜

When writing your own `excludeDirs`, make sure to keep it in a similar format. The second index in each sub-array is for easy readability inside the terminal and can be left empty.

```js
export default [
  ["/*node_modules/*", "node_modules/"],
  ["/*.git/*", ".git/"],
  // ... other exclusions ...
];
```

This default `excludeDirs` value excludes common directories and files that are typically not needed in a public directory, such as `node_modules`, `.git`, and various configuration and log files. Here is the full default [excludeDirs.](src/utils/excludeDirs.js)

## Conclusion 🎉

`public-sync` is a versatile tool that can help you manage your public and private directories more effectively. Whether you need to exclude sensitive data, avoid unnecessary files, or simply keep your public directory up-to-date, `public-sync` has you covered.

## FAQ 🤔

<details>
<summary>What's the difference between `.gitignore` and `public-sync`?</summary>
`.gitignore` excludes files from Git tracking, while `public-sync` automates the process of copying files from one directory to another, excluding specified files. This is useful when you want to keep sensitive files (like `.env`) in a private GitHub repo, but also share your code publicly. Instead of manually managing two repositories and copying files, `public-sync` does the heavy lifting for you.
</details>

<details>
<summary>Can I use `public-sync` with other programming languages?</summary>
Yes, `public-sync` is language-agnostic. You can use it with any programming language.
</details>

<details>
<summary>How do I specify which files `public-sync` should ignore?</summary>
You can specify the files to ignore in the `package.json` file. In the `public-sync` configuration, add the file names or patterns to the `ignore` array. for more detailed information go to the Regex section of the public-sync repository.
</details>

<details>
<summary>Can I customize the names of the `Private` and `Public` folders?</summary>
Yes, you can customize the folder names. However, you'll need to update the `public-sync` configuration in `package.json` to reflect the new folder names.
</details>

<details>
<summary>Can I use `public-sync` to sync more than two folders?</summary>
`public-sync` is designed to sync files from one source folder to one destination folder. If you need to sync multiple folders, you will need to put all the folders you would want to sync inside the source folder.
</details>

<details>
<summary>What types of files can I exclude from the sync process?</summary>
You can exclude any type of file from the sync process. Commonly excluded files include `.env` files, log files, and other files containing sensitive information.
</details>
