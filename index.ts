import * as core from '@actions/core'
import axios from 'axios'
import {logError, logSuccess, logInfo} from './log'
import {execSync} from 'child_process'

const deployFolderName = 'deploy-branch-root'
const deployLocationRoot = '/tmp'
const deployLocation = `${deployLocationRoot}/${deployFolderName}`

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

const runCommand = (cmd: string, errorMsg?: string): string => {
  try {
    const result = execSync(cmd).toString()
    console.log(result)
    return result
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

const deployNetlify = (): string => {
  logInfo('Deploying to netlify...')
  const token = requireEnvVar('INPUT_NETLIFY-AUTH-TOKEN')
  const siteID = requireInput('netlify-site-id')
  process.env['NETLIFY_AUTH_TOKEN'] = token
  process.env['NETLIFY_SITE_ID'] = siteID
  const result = runCommand(
    `cd ${deployLocation} && npx netlify-cli deploy --dir . --prod`
  )
  logSuccess('Successfully deployed to netlify!')
  return result
}

const commentOnCommit = async (comment: string): Promise<void> => {
  try {
    const inputs = {
      token: requireEnvVar('INPUT_GITHUB-TOKEN'),
      body: comment
    }
    core.debug(`Inputs: ${JSON.stringify(inputs, null, 4)}`)

    const sha = process.env.GITHUB_SHA
    core.debug(`SHA: ${sha}`)

    await axios.post(
      `/repos/${process.env.GITHUB_REPOSITORY}/commits/${sha}/comments`,
      {
        body: inputs.body
      },
      {
        headers: {authorization: `token ${inputs.token}`}
      }
    )
  } catch (error) {
    core.debug(JSON.stringify(error, null, 4))
    core.setFailed(error.message)
  }
}

async function run(): Promise<void> {
  try {
    const repo = requireEnvVar('GITHUB_REPOSITORY')
    const remoteRepo = `https://github.com/${repo}.git`

    const branch = requireInput('branch')
    const provider = requireInput('provider')

    runCommand(
      `git clone --single-branch --branch ${branch} --depth=1 ${remoteRepo} ${deployLocation}`,
      `Could not checkout branch ${branch}. Are you sure it exists?`
    )

    let result = null
    if (provider === 'NETLIFY') {
      result = deployNetlify()
    } else {
      logError(`Provider ${provider} is currently not supported`)
      process.exit(1)
    }

    console.log(result)
    await commentOnCommit(
      `Successfully deployed branch ${branch} to ${provider}. See below for deployment information:\n${result}`
    )
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()
