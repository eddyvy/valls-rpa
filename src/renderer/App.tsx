import React, { useEffect, useState } from 'react'
import logo from './assets/logo.png'
import { GoogleSearchModal } from './components/GoogleSearchModal'
import { LoginModal } from './components/LoginModal'
import { ResultsDisplay } from './components/ResultsDisplay'
import { StatusBar } from './components/StatusBar'
import { TaskCard } from './components/TaskCard'
import { UpdateModal } from './components/UpdateModal'
import './styles/globals.css'
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

  // Estado de autenticación
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [loginError, setLoginError] = useState<string | null>(null)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Estado para actualizaciones
  const [updateInfo, setUpdateInfo] = useState<UpdateInfo | null>(null)
  const [downloadProgress, setDownloadProgress] = useState<DownloadProgress | null>(null)

  useEffect(() => {
    // Verificar si hay un token guardado
    const checkAuth = async () => {
      try {
        const token = await window.electronAPI.getToken()
        setIsAuthenticated(!!token)
      } catch (error) {
        console.error('Error checking auth:', error)
        setIsAuthenticated(false)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()

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

  const handleLogin = async (username: string, password: string) => {
    setIsLoggingIn(true)
    setLoginError(null)

    try {
      const result = await window.electronAPI.login(username, password)

      if (result.success && result.token) {
        setIsAuthenticated(true)
        setLoginError(null)
      } else {
        setLoginError(result.message || 'Error de autenticación')
      }
    } catch (error) {
      console.error('Login error:', error)
      setLoginError('Error de conexión con el servidor')
    } finally {
      setIsLoggingIn(false)
    }
  }

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

  // Mostrar pantalla de carga mientras se verifica la autenticación
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <img src={logo} alt="logo" className="w-24 h-24 mx-auto mb-4 animate-pulse" />
          <p className="text-muted-foreground">Cargando...</p>
        </div>
      </div>
    )
  }

  // Mostrar modal de login si no está autenticado
  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
          <div className="text-center">
            <img src={logo} alt="logo" className="w-24 h-24 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Valls RPA</h1>
            <p className="text-muted-foreground">Automatización de procesos robóticos</p>
          </div>
        </div>
        <LoginModal
          isOpen={true}
          onLogin={handleLogin}
          isLoading={isLoggingIn}
          error={loginError}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 flex items-center justify-center gap-2">
            <img src={logo} alt="logo" className="w-12 h-12" /> Valls RPA
          </h1>
          <p className="text-muted-foreground">
            Automatización de procesos robóticos con TypeScript
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
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
    </div>
  )
}
