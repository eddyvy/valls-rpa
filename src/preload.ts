import { contextBridge, ipcRenderer } from 'electron'
import { TaskParams, TaskResult } from './tasks/types'

contextBridge.exposeInMainWorld('electronAPI', {
  executeTask: (taskName: string, params: TaskParams): Promise<TaskResult> =>
    ipcRenderer.invoke('execute-task', taskName, params),

  // APIs de autenticación
  login: (username: string, password: string) => ipcRenderer.invoke('login', username, password),
  getToken: () => ipcRenderer.invoke('get-token'),
  logout: () => ipcRenderer.invoke('logout'),

  // APIs de actualización
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  downloadUpdate: () => ipcRenderer.invoke('download-update'),
  quitAndInstall: () => ipcRenderer.invoke('quit-and-install'),

  // Listeners de actualización
  onUpdateStatus: (callback: (status: string) => void) => {
    ipcRenderer.on('update-status', (_, status) => callback(status))
  },
  onUpdateAvailable: (callback: (info: any) => void) => {
    ipcRenderer.on('update-available', (_, info) => callback(info))
  },
  onDownloadProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on('download-progress', (_, progress) => callback(progress))
  },
  onUpdateDownloaded: (callback: (info: any) => void) => {
    ipcRenderer.on('update-downloaded', (_, info) => callback(info))
  },
})

declare global {
  interface Window {
    electronAPI: {
      executeTask: (taskName: string, params: TaskParams) => Promise<TaskResult>
      login: (
        username: string,
        password: string
      ) => Promise<{ success: boolean; token?: string; message?: string }>
      getToken: () => Promise<string | null>
      logout: () => Promise<void>
      checkForUpdates: () => Promise<any>
      downloadUpdate: () => Promise<any>
      quitAndInstall: () => void
      onUpdateStatus: (callback: (status: string) => void) => void
      onUpdateAvailable: (callback: (info: any) => void) => void
      onDownloadProgress: (callback: (progress: any) => void) => void
      onUpdateDownloaded: (callback: (info: any) => void) => void
    }
  }
}
