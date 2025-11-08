import React, { useState } from 'react'

interface GoogleSearchModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (searchTerm: string) => void
  isLoading: boolean
}

export const GoogleSearchModal: React.FC<GoogleSearchModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading,
}) => {
  const [searchTerm, setSearchTerm] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      onSubmit(searchTerm.trim())
      setSearchTerm('')
    }
  }

  const handleClose = () => {
    setSearchTerm('')
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className={`modal ${isOpen ? 'active' : ''}`} onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>🔍 Búsqueda en Google</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="searchTerm">Término de búsqueda:</label>
            <input
              type="text"
              id="searchTerm"
              placeholder="Ej: Playwright RPA"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              disabled={isLoading}
              required
            />
          </div>
          <div className="button-group">
            <button
              type="button"
              className="btn-secondary"
              onClick={handleClose}
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary" disabled={isLoading}>
              Ejecutar
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
