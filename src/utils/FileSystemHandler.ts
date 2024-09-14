import fs, { existsSync, mkdirSync } from "fs"

export interface IFileSystemHandler {
    createFile(buffer: Buffer, path: string): Promise<boolean>
    deleteFile(path: string): Promise<boolean>
}

export class FileSystemHandler implements IFileSystemHandler {
    async createFile(buffer: Buffer, path: string): Promise<boolean> {
        try {
            await fs.promises.writeFile(path, buffer)
            return true
        } catch {
            return false
        }
    }

    async deleteFile(path: string): Promise<boolean> {
        try {
            await fs.promises.rm(path)
            return true
        } catch {
            return false
        }
    }

    createFolder(path: string): boolean {
        try {
          if (!existsSync(path)) {
            mkdirSync(path)
          }
    
          return true
        } catch {
          return false
        }
      }
}