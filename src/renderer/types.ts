export interface TaskCardData {
  icon: string
  title: string
  description: string
  taskName: string
}

export interface StatusType {
  message: string
  type: 'loading' | 'success' | 'error'
}

export interface UpdateInfo {
  version: string
  releaseDate?: string
  releaseName?: string
  releaseNotes?: string
}

export interface DownloadProgress {
  percent: number
  transferred: number
  total: number
  bytesPerSecond: number
}

export interface LoginResponse {
  message: string
  token: string | null
}

export interface LoginCredentials {
  username: string
  password: string
}
