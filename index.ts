import * as core from '@actions/core'
// import {execSync} from 'child_process'
import {logError, logSuccess, logInfo} from './log'
import {execSync} from 'child_process'

const requireEnvVar = (envVar: string): string => {
  const requested = process.env[envVar]
  if (requested) {
    return requested
  } else {
    const msg = `The enviornment variable "${envVar}" does not exist. It is required to run deploy-branch`
    logError(msg)
    core.setFailed(msg)
    process.exit(1)
  }
}

const runCommand = (cmd: string, errorMsg?: string): void => {
  try {
    console.log(execSync(cmd).toString())
  } catch (error) {
    console.error(error)
    const msg = errorMsg || error.toString()
    logError(msg)
    core.setFailed(msg)
    process.exit(1)
  }
}

const requireInput = (input: string): string => {
  const requested = core.getInput(input)
  if (requested) {
    return requested
  } else {
    const msg = `The input variable "${input}" does not exist. It is required to run deploy-branch`
    logError(msg)
    core.setFailed(msg)
    process.exit(1)
  }
}

// const deployZEIT = (branch: string): void => {
//   console.log(JSON.stringify(process.env, null, 4))
//   const token = requireEnvVar('INPUT_NOW-TOKEN')
//   try {
//     console.log(execSync(`git checkout remotes/origin/${branch}`).toString())
//     execSync(`npx now --token ${token}`)
//   } catch (error) {
//     failWithError('Could not deploy to zeit', error)
//   }
// }

const deployNetlify = (): void => {
  logInfo('Deploying to netlify...')
  const token = requireEnvVar('INPUT_NETLIFY_AUTH_TOKEN')
  const siteID = requireInput('netlify-site-id')
  process.env['NETLIFY_AUTH_TOKEN'] = token
  process.env['NETLIFY_SITE_ID'] = siteID
  execSync(`npx netlify deploy`)
}

async function run(): Promise<void> {
  try {
    const branch = requireInput('branch')
    const provider = requireInput('provider')

    runCommand(
      `git checkout remotes/origin/${branch}`,
      `Could not checkout branch ${branch}. Are you sure it exists?`
    )

    if (provider === 'NETLIFY') {
      deployNetlify()
    } else {
      logError(`Provider ${provider} is currently not supported`)
    }

    const msg = `Successfully deployed branch!`
    logSuccess(msg)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
