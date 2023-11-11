# public-sync

`public-sync` is a powerful tool designed to synchronize files from a private directory to a public directory. It's particularly useful when you want to exclude specific directories or files during the copying process, such as sensitive data or unnecessary files.

## Installation

Install `public-sync` as a development dependency using npm:

```bash
npm install --save-dev public-sync
```

## Configuration

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

## Regex expressions

- `/folder$/` - Targets a specific folder. Example: `/.git$/` to target `.git` folders.
- `/file.txt/` - Targets a specific file. Example: `/apiKeys.txt/` to target a file named `apiKeys.txt`.
- `/*.ext` - Targets all files with a specific extension. Example: `/*.env` to target all `.env` files.

## Usage

To use `public-sync`, add a script to your package.json:

```json
"scripts": {
  "sync": "public-sync"
}
```

Then, run the synchronization with `npm run sync`.

## Examples

### Use Case 1: Basic Usage and Directory Exclusion

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
### Use Case 2: Directory Modification and Interactive Features

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

### Use Case 3: Overriding and Exception Handling

The `override` option deletes unmatched files in `publicDir`. To keep specific files, directories, or file types, use `overrideExceptions`:

```json
"publicSync": {
  "override": true,
  "overrideExceptions": ["/extra.txt/", "/extra$/", "/*.env"]
}
```

This configuration will keep `extra.txt`, the `extra` directory, and all `.env` files in `publicDir`, even when other files are being overridden.

### Use Case 4: Interactive Mode

Interactive mode allows you to customize the synchronization process on the fly. Here's an example of how to use it:

```bash
npm run sync
> Enter private directory: ./ -f -x
> Enter directory to exclude & use the -f flag to finish: /*node_modules/*
> Enter directory to exclude & use the -f flag to finish: /*.git/* -f
```

In this example, the `-f` flag is used to finish the process, and the `-x` flag is used to customize exclusions. The directories `node_modules` and `.git` are excluded from the synchronization.

## Default `excludeDirs` value

When writing your own `excludeDirs`, make sure to keep it in a similar format. The second index in each sub-array is for easy readability inside the terminal and can be left empty.

```js
export default [
  ["/*node_modules/*", "node_modules/"],
  ["/*.git/*", ".git/"],
  // ... other exclusions ...
];
```

This default `excludeDirs` value excludes common directories and files that are typically not needed in a public directory, such as `node_modules`, `.git`, and various configuration and log files. Here is the full default [excludeDirs.](src/utils/excludeDirs.js)

## Conclusion

`public-sync` is a versatile tool that can help you manage your public and private directories more effectively. Whether you need to exclude sensitive data, avoid unnecessary files, or simply keep your public directory up-to-date, `public-sync` has you covered.
