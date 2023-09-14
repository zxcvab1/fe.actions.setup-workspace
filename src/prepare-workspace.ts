import * as core from '@actions/core'
import * as io from '@actions/io'
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
    const foldersInCurrentWorkspace = await io.findInPath(workspaceDir)
    for (const folderInWorkspace of foldersInCurrentWorkspace) {
      // Skip exclude folder
      if (!excludeDir?.includes(folderInWorkspace)) continue

      const folderPathInWorkspace = path.join(workspaceDir, folderInWorkspace)
      await io.rmRF(folderPathInWorkspace)
    }
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
  }
}
