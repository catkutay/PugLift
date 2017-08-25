const readline = require('readline')
const _ = require('lodash')
const branch = require('git-branch')
const json = require('../package.json')

require('colors')

const now = json.version.split('.')
const brch = branch.sync()

let snapshot = null

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

const result = () => {
  console.log(now, brch, snapshot)
}

const releaseTypeQuestion = callback => rl.question(`
Is this a RELEASE (feature complete) or SNAPSHOT (work in progress)? (r, s) `.green,
answer => {
  if (!['r', 's'].includes(answer.toLowerCase())) {
    console.log('\nERROR: You must type `r` or `s`'.red)
    return releaseTypeQuestion(callback)
  }

  snapshot = answer.toLowerCase() !== 'r'

  result()

  return callback
})

const changeSizeQuestion = callback => rl.question(`
Is this a breaking change, a new feature, or a patch?
  * MAJOR: Breaking change means that it is not backwards compatible.
    Something has significantly changed that will break old clients
  * MINOR: New feature means its got a shiny new feature
  * PATCH: Patch is a small fix that solves a problem with existing functionality
(MAJOR, MINOR, PATCH) `.green,
answer => {
  if (!['MAJOR', 'MINOR', 'PATCH'].includes(answer.toUpperCase())) {
    console.log('\nERROR: You must type `MAJOR`, `MINOR`, or `PATCH`'.red)
    return changeSizeQuestion(callback)
  }

  return callback
})

console.log('\nYou are about to publish a new version of Publift Analytics.'.cyan)
_.flow([releaseTypeQuestion, changeSizeQuestion])
