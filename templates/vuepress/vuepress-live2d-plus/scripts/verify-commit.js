// Invoked on the commit-msg git hook by yorkie.

import chalk from 'chalk'
const msgPath = process.env.GIT_PARAMS
import { readFileSync } from 'fs'
const msg = readFileSync(msgPath, 'utf-8').trim()

const commitRE =
  /^(revert: )?(feat|fix|docs|style|refactor|perf|test|chore|revert|release)(\(.+\))?: .{1,50}/

if (!commitRE.test(msg)) {
  console.error(
    `${chalk.bgRed.white('ERROR')} ${chalk.red('invalid commit message format.')}\n\n` +
      chalk.red(
        'Proper commit message format is required for automated changelog generation. Examples:\n\n'
      ) +
      `  ${chalk.green("feat(compiler): add 'comments' option")}\n` +
      `  ${chalk.green('fix(v-model): handle events on blur (close #28)')}\n`
  )
  process.exit(1)
}

// 用法 package.json 添加
// "gitHooks": {
//   "pre-commit": "lint-staged",
//   "commit-msg": "node scripts/verify-commit.js"
// }
