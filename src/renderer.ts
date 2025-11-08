interface StatusType {
  message: string
  type: 'loading' | 'success' | 'error'
}

class RPAApp {
  private statusEl: HTMLElement
  private resultsEl: HTMLElement
  private googleSearchModal: HTMLElement
  private updateModal: HTMLElement
  private googleSearchForm: HTMLFormElement

  constructor() {
    this.statusEl = document.getElementById('status')!
    this.resultsEl = document.getElementById('results')!
    this.updateModal = document.getElementById('updateModal')!
    this.googleSearchModal = document.getElementById('googleSearchModal')!
    this.googleSearchForm = document.getElementById('googleSearchForm') as HTMLFormElement

    this.initializeEventListeners()
    this.setupUpdateListeners()
  }

  private initializeEventListeners(): void {
    // Event listeners para las tarjetas de tareas
    document.querySelectorAll('.task-card').forEach((card) => {
      card.addEventListener('click', (e) => {
        const taskName = (e.currentTarget as HTMLElement).getAttribute('data-task')
        if (taskName) {
          this.openTask(taskName)
        }
      })
    })

    // Event listener para el formulario de Google
    this.googleSearchForm.addEventListener('submit', (e) => this.handleGoogleSearch(e))

    // Event listener para botón cancelar
    document.getElementById('cancelBtn')?.addEventListener('click', () => this.closeModal())

    // Cerrar modal al hacer clic fuera
    this.googleSearchModal.addEventListener('click', (e) => {
      if (e.target === this.googleSearchModal) {
        this.closeModal()
      }
    })
  }

  private openTask(taskName: string): void {
    if (taskName === 'googleSearch') {
      this.googleSearchModal.classList.add('active')
    } else {
      this.showStatus({
        message: 'Esta tarea está en desarrollo',
        type: 'loading',
      })
    }
  }

  private closeModal(): void {
    document.querySelectorAll('.modal').forEach((modal) => {
      modal.classList.remove('active')
    })
  }

  private showStatus(status: StatusType): void {
    const spinner = status.type === 'loading' ? '<span class="spinner"></span>' : ''
    this.statusEl.innerHTML = `${spinner}${status.message}`
    this.statusEl.className = `status active ${status.type}`
  }

  private hideStatus(): void {
    this.statusEl.classList.remove('active')
  }

  private showResults(data: string[]): void {
    if (data && data.length > 0) {
      this.resultsEl.innerHTML = `
        <h3>📊 Resultados:</h3>
        <ul>
          ${data.map((item, i) => `<li><strong>${i + 1}.</strong> ${item}</li>`).join('')}
        </ul>
      `
      this.resultsEl.classList.add('active')
    }
  }

  private hideResults(): void {
    this.resultsEl.classList.remove('active')
  }

  private setFormDisabled(disabled: boolean): void {
    const submitBtn = document.getElementById('submitBtn') as HTMLButtonElement
    const searchInput = document.getElementById('searchTerm') as HTMLInputElement

    submitBtn.disabled = disabled
    searchInput.disabled = disabled
  }

  private async handleGoogleSearch(e: Event): Promise<void> {
    e.preventDefault()

    const searchInput = document.getElementById('searchTerm') as HTMLInputElement
    const searchTerm = searchInput.value.trim()

    if (!searchTerm) return

    this.closeModal()
    this.hideResults()
    this.setFormDisabled(true)
    this.showStatus({
      message: '🤖 Ejecutando búsqueda en Google...',
      type: 'loading',
    })

    try {
      const result = await window.electronAPI.executeTask('googleSearch', {
        searchTerm,
      })

      if (result.success) {
        this.showStatus({
          message: '✅ Búsqueda completada exitosamente',
          type: 'success',
        })
        this.showResults(result.data)
      } else {
        this.showStatus({
          message: `❌ Error: ${result.error}`,
          type: 'error',
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido'
      this.showStatus({
        message: `❌ Error: ${errorMessage}`,
        type: 'error',
      })
    } finally {
      this.setFormDisabled(false)
      searchInput.value = ''
    }
  }

  private setupUpdateListeners(): void {
    // Listener para actualizaciones disponibles
    window.electronAPI.onUpdateAvailable((info) => {
      const updateMessage = document.getElementById('updateMessage')!
      updateMessage.textContent = `Nueva versión ${info.version} disponible`
      this.updateModal.classList.add('active')
    })

    // Listener para progreso de descarga
    window.electronAPI.onDownloadProgress((progress) => {
      const progressBar = document.getElementById('progressBar')!
      const progressText = document.getElementById('progressText')!
      const updateProgress = document.getElementById('updateProgress')!

      updateProgress.style.display = 'block'
      progressBar.style.width = `${progress.percent}%`
      progressText.textContent = `${Math.round(
        progress.percent
      )}% - ${this.formatBytes(progress.transferred)} / ${this.formatBytes(progress.total)}`
    })

    // Listener para descarga completada
    window.electronAPI.onUpdateDownloaded((_info) => {
      const downloadBtn = document.getElementById('downloadUpdateBtn')!
      const installBtn = document.getElementById('installUpdateBtn')!
      const updateMessage = document.getElementById('updateMessage')!

      downloadBtn.style.display = 'none'
      installBtn.style.display = 'block'
      updateMessage.textContent = 'Actualización lista para instalar'
    })

    // Botón descargar actualización
    document.getElementById('downloadUpdateBtn')?.addEventListener('click', () => {
      window.electronAPI.downloadUpdate()
      ;(document.getElementById('downloadUpdateBtn') as HTMLButtonElement).disabled = true
    })

    // Botón instalar actualización
    document.getElementById('installUpdateBtn')?.addEventListener('click', () => {
      window.electronAPI.quitAndInstall()
    })

    // Botón más tarde
    document.getElementById('updateLaterBtn')?.addEventListener('click', () => {
      this.updateModal.classList.remove('active')
    })
  }

  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  new RPAApp()
})
