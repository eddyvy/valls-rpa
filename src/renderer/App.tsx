import React, { useEffect, useState } from 'react'
import logo from './assets/logo.png'
import { GoogleSearchModal } from './components/GoogleSearchModal'
import { ResultsDisplay } from './components/ResultsDisplay'
import { StatusBar } from './components/StatusBar'
import { TaskCard } from './components/TaskCard'
import { UpdateModal } from './components/UpdateModal'
import './styles/App.css'
import { DownloadProgress, StatusType, TaskCardData, UpdateInfo } from './types'

const TASKS: TaskCardData[] = [
  {
    icon: '🔍',
    title: 'Búsqueda en Google',
    description: 'Realiza búsquedas automatizadas y extrae los primeros resultados',
    taskName: 'googleSearch',
  },
  {
    icon: '📊',
    title: 'Web Scraping',
    description: 'Extrae datos de sitios web de forma automatizada',
    taskName: 'webScraping',
  },
  {
    icon: '📝',
    title: 'Rellenar Formularios',
    description: 'Completa formularios web automáticamente',
    taskName: 'formFiller',
  },
  {
    icon: '⚙️',
    title: 'Tarea Personalizada',
    description: 'Crea tu propia automatización',
    taskName: 'custom',
  },
]

export const App: React.FC = () => {
  const [activeModal, setActiveModal] = useState<string | null>(null)
  const [status, setStatus] = useState<StatusType | null>(null)
  const [results, setResults] = useState<string[] | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Estado para actualizaciones
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null)

  useEffect(() => {
    // Configurar listeners de actualización
    window.electronAPI.onUpdateAvailable((info: UpdateInfo) => {
      setUpdateInfo(info)
    })

    window.electronAPI.onDownloadProgress((progress: DownloadProgress) => {
      setDownloadProgress(progress)
    })

    window.electronAPI.onUpdateDownloaded((_info: UpdateInfo) => {
      // El componente UpdateModal maneja este estado internamente
    })
  }, [])

  const handleTaskClick = (taskName: string) => {
    if (taskName === 'googleSearch') {
      setActiveModal('googleSearch')
    } else {
      setStatus({
        message: 'Esta tarea está en desarrollo',
        type: 'loading',
      })
      setTimeout(() => setStatus(null), 3000)
    }
  }

  const handleGoogleSearch = async (searchTerm: string) => {
    setActiveModal(null)
    setResults(null)
    setIsLoading(true)
    setStatus({
      message: '🤖 Ejecutando búsqueda en Google...',
      type: 'loading',
    })

    try {
      const result = await window.electronAPI.executeTask('googleSearch', { searchTerm })

      if (result.success) {
        setStatus({
          message: '✅ Búsqueda completada exitosamente',
          type: 'success',
        })
        setResults(result.data)
      } else {
        setStatus({
          message: `❌ Error: ${result.error}`,
          type: 'error',
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      setStatus({
        message: `❌ Error: ${errorMessage}`,
        type: 'error',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadUpdate = () => {
    window.electronAPI.downloadUpdate()
  }

  const handleInstallUpdate = () => {
    window.electronAPI.quitAndInstall()
  }

  const handleUpdateLater = () => {
    setUpdateInfo(null)
    setDownloadProgress(null)
  }

  return (
    <div className="container">
      <h1>
        <img src={logo} alt="logo" /> Valls RPA
      </h1>
      <p className="subtitle">Automatización de procesos robóticos con TypeScript</p>

      <div className="tasks-grid">
        {TASKS.map((task) => (
          <TaskCard key={task.taskName} {...task} onClick={handleTaskClick} />
        ))}
      </div>

      <StatusBar status={status} />
      <ResultsDisplay results={results} />

      <GoogleSearchModal
        isOpen={activeModal === 'googleSearch'}
        onClose={() => setActiveModal(null)}
        onSubmit={handleGoogleSearch}
        isLoading={isLoading}
      />

      <UpdateModal
        updateInfo={updateInfo}
        downloadProgress={downloadProgress}
        onDownload={handleDownloadUpdate}
        onInstall={handleInstallUpdate}
        onLater={handleUpdateLater}
      />
    </div>
  )
}
