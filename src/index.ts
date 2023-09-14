import * as core from '@actions/core'
import * as io from '@actions/io'
import fs from 'fs/promises'
import path from 'path'
import { WORKSPACE_TEMPLATE_DIR } from './constant'
import { prepareWorkspaceDirectory } from './prepare-workspace'

const run = async (): Promise<void> => {
  const workspaceDir = process.cwd()
  const inputBaseAppDir = core.getInput('appBaseDir')

  core.debug(workspaceDir)
  core.debug(inputBaseAppDir)

  try {
    await prepareWorkspaceDirectory({
      workspaceDir,
      excludeDir:
        typeof inputBaseAppDir === 'string' ? [inputBaseAppDir] : ['app']
    })

    const foldersInWorkspaceTemplate = await fs.readdir(WORKSPACE_TEMPLATE_DIR)
    core.debug(JSON.stringify(foldersInWorkspaceTemplate, null, 2))
    for (const templateFolder of foldersInWorkspaceTemplate) {
      const templateFolderPath = path.join(
        WORKSPACE_TEMPLATE_DIR,
        templateFolder
      )
      core.debug(templateFolderPath)
      core.info(`Copy ${templateFolder} from workspace template to workspace`)
      await io.cp(templateFolderPath, workspaceDir, {
        force: true,
        recursive: true
      })
    }

    core.info('Setup workspace successfully')
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}

run()
