import React, { useState } from 'react'
import { DownloadProgress, UpdateInfo } from '../types'

interface UpdateModalProps {
  updateInfo: UpdateInfo | null
  downloadProgress: DownloadProgress | null
  onDownload: () => void
  onInstall: () => void
  onLater: () => void
}

export const UpdateModal: React.FC<UpdateModalProps> = ({
  updateInfo,
  downloadProgress,
  onDownload,
  onInstall,
  onLater,
}) => {
  const [isDownloading, setIsDownloading] = useState(false)
  const [isDownloaded, setIsDownloaded] = useState(false)

  if (!updateInfo) return null

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const handleDownload = () => {
    setIsDownloading(true)
    onDownload()
  }

  // Detectar cuando se completa la descarga
  React.useEffect(() => {
    if (downloadProgress && downloadProgress.percent >= 100) {
      setIsDownloaded(true)
      setIsDownloading(false)
    }
  }, [downloadProgress])

  return (
    <div className="modal active">
      <div className="modal-content">
        <h2>🔄 Actualización Disponible</h2>
        <p id="updateMessage">
          {isDownloaded
            ? 'Actualización lista para instalar'
            : `Nueva versión ${updateInfo.version} disponible`}
        </p>

        {isDownloading && downloadProgress && (
          <div id="updateProgress" style={{ marginTop: '20px' }}>
            <div style={{ background: '#e0e0e0', borderRadius: '10px', overflow: 'hidden' }}>
              <div
                style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  height: '30px',
                  width: `${downloadProgress.percent}%`,
                  transition: 'width 0.3s',
                }}
              ></div>
            </div>
            <p style={{ textAlign: 'center', color: '#666', marginTop: '10px' }}>
              {Math.round(downloadProgress.percent)}% - {formatBytes(downloadProgress.transferred)}{' '}
              / {formatBytes(downloadProgress.total)}
            </p>
          </div>
        )}

        <div className="button-group" style={{ marginTop: '20px' }}>
          <button
            type="button"
            className="btn-secondary"
            onClick={onLater}
            disabled={isDownloading}
          >
            Más tarde
          </button>
          {!isDownloaded ? (
            <button
              type="button"
              className="btn-primary"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              {isDownloading ? 'Descargando...' : 'Descargar'}
            </button>
          ) : (
            <button type="button" className="btn-primary" onClick={onInstall}>
              Instalar y Reiniciar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
