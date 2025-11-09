import React, { useState } from 'react'
import { Button } from './ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'

interface LoginModalProps {
  isOpen: boolean
  onLogin: (username: string, password: string) => void
  isLoading: boolean
  error: string | null
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onLogin, isLoading, error }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (username && password) {
      onLogin(username, password)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[425px]" hideClose>
        <DialogHeader>
          <DialogTitle>Iniciar Sesión</DialogTitle>
          <DialogDescription>
            Ingresa tus credenciales para acceder a la aplicación
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="username">Usuario</Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ingresa tu usuario"
                disabled={isLoading}
                autoFocus
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Ingresa tu contraseña"
                disabled={isLoading}
              />
            </div>
            {error && (
              <div className="text-sm text-red-500 bg-red-50 dark:bg-red-950 p-3 rounded">
                {error}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading || !username || !password}>
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
