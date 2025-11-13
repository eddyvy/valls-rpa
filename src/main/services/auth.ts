import axios from 'axios'
import { app } from 'electron'
import * as fs from 'fs'
import * as path from 'path'
import { AppConfig } from '../../config'

interface LoginResponse {
  message: string
  token: string | null
}

interface LoginResult {
  success: boolean
  token?: string
  message?: string
}

interface CheckTokenResponse {
  success: boolean
  message: string
  payload?: {
    user: string
    exp: number
    iat: number
  }
}

class AuthService {
  private tokenPath: string
  private token: string | null = null

  constructor() {
    const userDataPath = app.getPath('userData')
    this.tokenPath = path.join(userDataPath, 'auth-token.txt')
    this.loadToken()
  }

  private loadToken(): void {
    try {
      if (fs.existsSync(this.tokenPath)) {
        this.token = fs.readFileSync(this.tokenPath, 'utf-8').trim()
      }
    } catch (error) {
      console.error('Error loading token:', error)
      this.token = null
    }
  }

  private saveToken(token: string): void {
    try {
      fs.writeFileSync(this.tokenPath, token, 'utf-8')
      this.token = token
    } catch (error) {
      console.error('Error saving token:', error)
      throw error
    }
  }

  private deleteToken(): void {
    try {
      if (fs.existsSync(this.tokenPath)) {
        fs.unlinkSync(this.tokenPath)
      }
      this.token = null
    } catch (error) {
      console.error('Error deleting token:', error)
    }
  }

  async login(username: string, password: string): Promise<LoginResult> {
    try {
      const response = await axios.post<LoginResponse>(
        `${AppConfig.BACK_URL}/auth`,
        {
          user: username,
          password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (response.status === 200) {
        const { message, token } = response.data

        if (token) {
          this.saveToken(token)
          return {
            success: true,
            token,
            message,
          }
        } else {
          return {
            success: false,
            message,
          }
        }
      }

      return {
        success: false,
        message: 'Error desconocido en el servidor',
      }
    } catch (error) {
      console.error('Login error:', error)

      if (axios.isAxiosError(error) && error.response) {
        const message = error.response.data?.message || 'Error de autenticación'
        return {
          success: false,
          message,
        }
      }

      return {
        success: false,
        message: error instanceof Error ? error.message : 'Error de red',
      }
    }
  }

  getToken(): string | null {
    return this.token
  }

  logout(): void {
    this.deleteToken()
  }

  async checkToken(): Promise<CheckTokenResponse> {
    const outcome: CheckTokenResponse = {
      success: false,
      message: 'Token no verificado',
    }

    if (!this.token) {
      outcome.message = 'No hay token disponible'
    } else {
      try {
        const response = await axios.get<CheckTokenResponse>(`${AppConfig.BACK_URL}/check-token`, {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
        })

        outcome.success = response.data.success
        outcome.message = response.data.message
        outcome.payload = response.data.payload
      } catch (error) {
        console.error('Check token error:', error)

        if (axios.isAxiosError(error) && error.response) {
          const message = error.response.data?.message || 'Error al verificar el token'
          outcome.message = message
          return {
            success: false,
            message,
          }
        } else {
          outcome.message = error instanceof Error ? error.message : 'Error de red'
        }
      }
    }

    if (outcome.success === false) {
      this.deleteToken()
    }

    return outcome
  }
}

export const authService = new AuthService()
