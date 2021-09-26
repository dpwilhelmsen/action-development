# Compare JSON values at last two tags

This action compares a json file at the last two tags and determines if any of the given values have changed.

## Inputs

## `githubToken`

**Required** The user's github token, provided by `${{ secrets.GITHUB_TOKEN }}`.

## `compareKeys`

**Required** A JSON stringified array of keys on the target objects to compare.

## `filePath`

**Required** The path from the root of the project to the json file to compare.

## Outputs

## `valuesMatch`

Whether all the values match. True if nothing has changed, false if they have.

## Development

The javascript source is located in `index.js` and is compiled with `@vercel/ncc`. To build, first install `ncc`
using `npm i -g @vercel/ncc`. Then compile with the command: `ncc build index.js`
