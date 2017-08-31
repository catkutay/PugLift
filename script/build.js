const readline = require('readline')
const semver = require('semver')
const replace = require('replace-in-file')
const branch = require('git-branch')
const colors = require('colors')
const pkg = require('../package.json')

const brch = branch.sync()

colors.setTheme({
  question: 'green',
  error: 'red',
  info: 'cyan',
  warn: 'yellow',
})

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const changeSizeQuestion = callback => rl.question(`
Is this a breaking change, a new feature, or a patch?
  * MAJOR: Breaking change means that it is not backwards compatible.
    Something has significantly changed that will break old clients
  * MINOR: New feature means its got a shiny new feature
  * PATCH: Patch is a small fix that solves a problem with existing functionality
(MAJOR, MINOR, PATCH) `.question,
answer => {
  if (!['MAJOR', 'MINOR', 'PATCH'].includes(answer.toUpperCase())) {
    console.log('\nERROR: You must type `MAJOR`, `MINOR`, or `PATCH`'.error)
    return changeSizeQuestion(callback)
  }

  return callback(answer.toLowerCase())
})

const updateVersion = callback => {
  if (brch === 'master') {
    if (semver.prerelease(pkg.version)) {
      callback(semver.inc(pkg.version))
    } else {
      console.log(`\nYou are on the master branch.\n * If you need to make changes to your code, please move to a new branch`.warn)
      callback(pkg.version)
    }
  } else {
    if (semver.prerelease(pkg.version)) {
      callback(semver.inc(pkg.version, 'prerelease'))
    } else {
      changeSizeQuestion(answer => callback(semver.inc(pkg.version, `pre${answer}`, 'rc')))
    }
  }
}

const updateVersionAndBranch = version => {
  replace({
    files: './package.json',
    from: [/("version":) ".*"/, /("branch":) ".*"/],
    to: [`$1 "${version}"`, `$1 "${brch}"`],
  }).then(file => console.log('\nReady to publish Publift Analytics.\n'.info))
}

const updatePkg = () => {
  console.log('\nBuilding a new version of Publift Analytics.'.info)

  updateVersion(version => {
    rl.close()
    updateVersionAndBranch(version)
  })
}

updatePkg()
