import * as core from '@actions/core'
import * as io from '@actions/io'
import fs from 'fs/promises'
import path from 'path'

type PrepareWorkspaceDirectory = {
  workspaceDir: string
  excludeDir?: string[]
}
export const prepareWorkspaceDirectory = async ({
  workspaceDir,
  excludeDir
}: PrepareWorkspaceDirectory): Promise<void> => {
  try {
    core.info('Prepare workspace directory')
    const foldersInCurrentWorkspace = await fs.readdir(workspaceDir)
    for (const folderInWorkspace of foldersInCurrentWorkspace) {
      // Skiping folder app because it create from actions-checkout@v3
      if (!excludeDir?.includes(folderInWorkspace)) continue

      const folderPathInWorkspace = path.join(workspaceDir, folderInWorkspace)
      io.rmRF(folderPathInWorkspace)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
