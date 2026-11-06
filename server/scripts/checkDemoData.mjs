// Checks the demo data for mistakes (a misspelled username, a post without a real title, a missing picture,
// a report made by the wrong person, ...) without touching any database. Run it from the repo root:
//
//     node server/scripts/checkDemoData.mjs
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import * as baseData from './demoData.mjs'
import { buildDemoSet, checkDemoSet } from './demoMerge.mjs'

const imageDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../demo/images')
const images = new Set(fs.readdirSync(imageDir))
const set = buildDemoSet(baseData)
const problems = checkDemoSet(set, { images })

console.log(
    `${set.USERS.length} people, ${set.POSTS.length} posts, ${set.EVENTS.length} events, ${set.FAQS.length} FAQs, ` +
        `${set.DIRECT_MESSAGES.length} private conversations`
)
if (problems.length) {
    console.error('\nProblems found:\n  ' + problems.join('\n  '))
    process.exit(1)
}
console.log('No problems found.')