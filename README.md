# public-sync

`public-sync` is a powerful tool for synchronizing files from a private directory to a public directory. It provides flexibility in excluding specific directories during the copying process.

## Installation

Install `public-sync` as a development dependency using npm:

```bash
npm install --save-dev public-sync
```

## Configuration

Configure `public-sync` by including a "publicSync" section in your package.json. Below is the default configuration:

```json
"publicSync": {
  "debug": {
    "showCopied": true,
    "showNotCopied": false
  },
  "publicDir": "./publicSync/",
  "privateDir": "./",
  "excludeDirs": "[[Regex expression, readable directory], ...]",
  "addExcludes": "[]",
  "interactive": "false"
}
```
(Refer to the end for the full `excludeDirs` default value as it's lengthy.)

- `publicDir`: Destination directory for copied files.
- `privateDir`: Source directory for copying files.
- `excludeDirs`: Array of directory patterns to exclude.
- `addExcludes`: Additional exclusions that can be used in combination with `excludeDirs`.
- `interactive`: When true, enables advanced interactive configuration options (see "Example 4").

## Usage

To use `public-sync`, add a script to your package.json:

```json
"scripts": {
  "sync": "public-sync"
}
```

Run synchronization with `npm run sync`.

## Examples

### Example 1: Basic Usage

With the default configuration, `public-sync` copies all files from the root `./` to `./publicSync`, excluding specified directories in `excludeDirs` and `addExcludes`.

### Example 2: Excluding Additional Directories

To exclude more directories, add them to the `addExcludes` array in package.json:

```json
"publicSync": {
  "publicDir": "./public",
  "privateDir": "./private",
  "addExcludes": [
    ["/*apiKeys/*", "Api keys"],
    ["/*.zip", ".zip"]
  ]
}
```

This instructs `public-sync` to exclude directories with "apiKeys" and files with a ".zip" extension during synchronization.

### Example 3: Modifying Source and Destination Directories

Change the source and destination directories in package.json:

```json
"publicSync": {
  "publicDir": "./new_public",
  "privateDir": "./new_private"
}
```

Now, `public-sync` copies files from `./new_private` to `./new_public`.

### Example 4: Using the interactive features

The `interactive` config option provides advanced flexibility:

Use Flags:
- `-f` to make the public directory the same as the private directory.
- `-s` to skip warnings when the public directory already exists.
- `-x` to customize directories to exclude.
- `-d` to use default directories to exclude.

Example:

```bash
npm run sync
> Enter private directory: ./ -f -x
> Enter directory to exclude & use the -f flag to finish: /*node_modules/*
> Enter directory to exclude & use the -f flag to finish: /*.git/* -f
```

This empowers you to tailor `public-sync` to your project's specific requirements. Future developments aim to simplify customization for bulk file synchronization with unique configurations.

## Default excludeDirs value
When writing your own excludeDirs, make sure to keep it in a similar format.
The 2nd index in each sub array does not matter as it is purely for easy readability inside the terminal, it can be left empty.
```js
export default [
  ["/*node_modules/*", "node_modules/"],
  ["/*.git/*", ".git/"],
  ["/*.env", ".env"],
  ["/*.json", ".json"],
  ["/*.npmrc", ".npmrc"],
  ["/*.dockerenv", ".dockerenv"],
  ["/*Dockerfile", "Dockerfile"],
  ["/*.htpasswd", ".htpasswd"],
  ["/*.htaccess", ".htaccess"],
  ["/*.DS_Store", ".DS_Store"],
  ["/*.idea/*", ".idea/"],
  ["/*.log", ".log"],
  ["/*.bak", ".bak"],
  ["/*.swp", ".swp"],
  ["/*.lock", ".lock"],
  ["/*.pem", ".pem"],
  ["/*.key", ".key"],
  ["/*.crt", ".crt"],
  ["/*.cert", ".cert"],
  ["/*.pfx", ".pfx"],
  ["/*.p12", ".p12"],
  ["/*.jks", ".jks"],
  ["/*.keystore", ".keystore"],
  ["/*.ovpn", ".ovpn"],
  ["/*.cscfg", ".cscfg"],
  ["/*.rdp", ".rdp"],
  ["/*.mdf", ".mdf"],
  ["/*.sdf", ".sdf"],
  ["/*.sqlite", ".sqlite"],
  ["/*.sql", ".sql"],
  ["/*.csv", ".csv"],
  ["/*.xml", ".xml"],
  ["/*.yml", ".yml"],
  ["/*.yaml", ".yaml"],
  ["/*.ini", ".ini"],
  ["/*.conf", ".conf"],
  ["/*.config", ".config"],
  ["/*.properties", ".properties"],
  ["/*.env.example", ".env.example"],
  ["/*.env.local", ".env.local"],
  ["/*.env.development", ".env.development"],
  ["/*.env.production", ".env.production"],
  ["/*.env.test", ".env.test"],
  ["/*.env.staging", ".env.staging"],
  ["/*.gitignore", ".gitignore"],
  ["/*.config.*", ".config."],
  ["/*vite-env.d.ts", "vite-env.d.ts"],
  ["/*.babelrc", ".babelrc"],
  ["/*.eslintrc.cjs", ".eslintrc.cjs"],
  ["/*.prettierrc", ".prettierrc"],
  ["/*.stylelintrc", ".stylelintrc"],
  ["/*.tsconfig.json", ".tsconfig.json"],
  ["/*.webpack.config.js", ".webpack.config.js"],
  ["/*.rollup.config.js", ".rollup.config.js"],
  ["/*.jest.config.js", ".jest.config.js"],
  ["/*.npmignore", ".npmignore"],
  ["/*.editorconfig", ".editorconfig"],
  ["/*.eslintignore", ".eslintignore"],
  ["/*.prettierignore", ".prettierignore"],
  ["/*.nvmrc", ".nvmrc"],
  ["/*.npmrc", ".npmrc"],
  ["/*.yarnrc", ".yarnrc"],
  ["/*.huskyrc", ".huskyrc"],
  ["/*.lintstagedrc", ".lintstagedrc"],
  ["/*.dockerignore", ".dockerignore"],
  ["/*.gitattributes", ".gitattributes"],
  ["/*.gitmodules", ".gitmodules"],
  ["/*.gitlab-ci.yml", ".gitlab-ci.yml"],
  ["/*.travis.yml", ".travis.yml"],
  ["/*.circleci/*", ".circleci/"],
  ["/*.github/*", ".github/"]
]
```