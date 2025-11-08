import { app, BrowserWindow, ipcMain } from 'electron'
import { autoUpdater } from 'electron-updater'
import * as path from 'path'
import { TaskResult, TaskParams } from './tasks/types'

let mainWindow: BrowserWindow | null

// Configurar autoUpdater
autoUpdater.autoDownload = false // No descargar automáticamente
autoUpdater.autoInstallOnAppQuit = true

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    icon: path.join(__dirname, '../build/icon.png'),
  })

  mainWindow.loadFile(path.join(__dirname, '../src/index.html'))

  mainWindow.on('closed', () => {
    mainWindow = null
  })

  // Verificar actualizaciones al iniciar
  if (!app.isPackaged) {
    console.log('Modo desarrollo - actualizaciones deshabilitadas')
  } else {
    setTimeout(() => {
      autoUpdater.checkForUpdates()
    }, 3000)
  }
}

app.whenReady().then(() => {
  createWindow()
  setupAutoUpdater()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// Configurar eventos de actualización
function setupAutoUpdater(): void {
  autoUpdater.on('checking-for-update', () => {
    sendStatusToWindow('Verificando actualizaciones...')
  })

  autoUpdater.on('update-available', (info) => {
    sendStatusToWindow('Actualización disponible')
    if (mainWindow) {
      mainWindow.webContents.send('update-available', info)
    }
  })

  autoUpdater.on('update-not-available', (info) => {
    sendStatusToWindow('La aplicación está actualizada')
  })

  autoUpdater.on('error', (err) => {
    sendStatusToWindow('Error al verificar actualizaciones: ' + err)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    let message = `Velocidad: ${progressObj.bytesPerSecond}`
    message += ` - Descargado ${progressObj.percent}%`
    message += ` (${progressObj.transferred}/${progressObj.total})`
    sendStatusToWindow(message)
    if (mainWindow) {
      mainWindow.webContents.send('download-progress', progressObj)
    }
  })

  autoUpdater.on('update-downloaded', (info) => {
    sendStatusToWindow('Actualización descargada')
    if (mainWindow) {
      mainWindow.webContents.send('update-downloaded', info)
    }
  })
}

function sendStatusToWindow(text: string): void {
  console.log(text)
  if (mainWindow) {
    mainWindow.webContents.send('update-status', text)
  }
}

// IPC Handlers
ipcMain.handle(
  'execute-task',
  async (event, taskName: string, params: TaskParams): Promise<TaskResult> => {
    try {
      console.log(`Ejecutando tarea: ${taskName}`, params)
      const taskModule = require(path.join(__dirname, `tasks/${taskName}`))
      const result = await taskModule.execute(params)
      return { success: true, data: result }
    } catch (error) {
      console.error('Error ejecutando tarea:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Error desconocido',
      }
    }
  }
)

ipcMain.handle('check-for-updates', async () => {
  if (app.isPackaged) {
    return await autoUpdater.checkForUpdates()
  }
  return null
})

ipcMain.handle('download-update', async () => {
  if (app.isPackaged) {
    return await autoUpdater.downloadUpdate()
  }
  return null
})

ipcMain.handle('quit-and-install', () => {
  autoUpdater.quitAndInstall()
})
