import * as core from '@actions/core'
// import {execSync} from 'child_process'
import {logError, logSuccess} from './log'

const failWithError = (msg: string, error?: Error): string => {
  console.error(error || msg)
  logError(msg)
  core.setFailed(msg)
  process.exit(1)
}

const requireEnvVar = (envVar: string): string => {
  const requested = process.env[envVar]
  if (requested) {
    return requested
  } else {
    const msg = `The enviornment variable "${envVar}" does not exist. It is required to run deploy-branch`
    return failWithError(msg)
  }
}

const requireInput = (input: string): string => {
  const requested = core.getInput(input)
  if (requested) {
    return requested
  } else {
    const msg = `The input variable "${input}" does not exist. It is required to run deploy-branch`
    return failWithError(msg)
  }
}

const deployZEIT = (branch: string): void => {
  console.log(JSON.stringify(process.env, null, 4))
  console.log('branch', branch)
  const token = requireEnvVar('NOW_TOKEN')
  console.log('token', token)
}

async function run(): Promise<void> {
  try {
    const branch = requireInput('branch')
    const provider = requireInput('provider')

    if (provider === 'ZEIT') {
      deployZEIT(branch)
    } else {
      failWithError(`Provider ${provider} is currently not supported`)
    }

    const msg = `Successfully deployed branch!`
    logSuccess(msg)
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
