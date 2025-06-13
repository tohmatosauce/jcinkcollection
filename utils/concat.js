/* stack overflow: https://stackoverflow.com/questions/29697182/concat-in-npm-using-a-glob-input-no-grunt-or-gulp */

import fs from 'fs'
import { globSync } from 'glob'

const args = process.argv.splice(2)

// if (fs.existsSync(args[1]))
//   fs.unlinkSync(args[1]);

const files = globSync(args[0])
files.forEach((file) => {
  if(globSync(args[1])[0] === file) return false;
  fs.appendFileSync(args[1], fs.readFileSync(file, 'utf-8'));
})