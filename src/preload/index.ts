/**
 * PRELOAD SCRIPT (PUENTE/BRIDGE)
 *
 * Este script se ejecuta antes de cargar el renderer y actúa como puente seguro.
 * Expone APIs controladas del proceso principal al proceso de renderizado.
 *
 * IMPORTANTE:
 * - Corre con privilegios de Node.js pero en el contexto del renderer
 * - contextBridge.exposeInMainWorld es la única forma segura de exponer APIs
 * - Nunca exponer require(), process, o módulos completos de Node.js
 */

import { contextBridge, ipcRenderer } from 'electron'
import type { TaskParams, TaskResult } from '../main/tasks/types'

contextBridge.exposeInMainWorld('electronAPI', {
  executeTask: (taskName: string, params: TaskParams): Promise<TaskResult> =>
    ipcRenderer.invoke('execute-task', taskName, params),

  // APIs de autenticación
  login: (username: string, password: string) => ipcRenderer.invoke('login', username, password),
  getToken: () => ipcRenderer.invoke('get-token'),
  logout: () => ipcRenderer.invoke('logout'),
  checkToken: () => ipcRenderer.invoke('check-token'),

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
      checkToken: () => Promise<{
        success: boolean
        message: string
        payload?: { user: string; exp: number; iat: number }
      }>
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
