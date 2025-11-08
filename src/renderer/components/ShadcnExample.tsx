import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

/**
 * Ejemplo de componente que demuestra el uso de componentes shadcn/ui
 * Este archivo es solo para referencia y puede ser eliminado
 */
export const ShadcnExample: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-3xl font-bold">Ejemplos de shadcn/ui</h1>

      {/* Ejemplo de Buttons */}
      <Card>
        <CardHeader>
          <CardTitle>Botones</CardTitle>
          <CardDescription>Diferentes variantes de botones disponibles</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          <Button>Default</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="link">Link</Button>
        </CardContent>
      </Card>

      {/* Ejemplo de Card con formulario */}
      <Card className="max-w-md">
        <CardHeader>
          <CardTitle>Crear cuenta</CardTitle>
          <CardDescription>Ingresa tus datos para crear una nueva cuenta</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre</Label>
            <Input id="name" placeholder="Juan Pérez" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="juan@ejemplo.com" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" type="password" />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Crear cuenta</Button>
        </CardFooter>
      </Card>

      {/* Ejemplo de Dialog */}
      <Card>
        <CardHeader>
          <CardTitle>Diálogo Modal</CardTitle>
          <CardDescription>Ejemplo de uso del componente Dialog</CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Abrir Diálogo</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>¿Estás seguro?</DialogTitle>
                <DialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente tus datos.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="outline">Cancelar</Button>
                <Button variant="destructive">Confirmar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Ejemplo de Grid con Cards */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Grid de Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>Card {i}</CardTitle>
                <CardDescription>Descripción de la card {i}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>Contenido de ejemplo para la card número {i}</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Ver más
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      {/* Ejemplo de diferentes tamaños de Button */}
      <Card>
        <CardHeader>
          <CardTitle>Tamaños de Botones</CardTitle>
          <CardDescription>Diferentes tamaños disponibles</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <Button size="sm">Pequeño</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Grande</Button>
          <Button size="icon">🔍</Button>
        </CardContent>
      </Card>

      {/* Ejemplo de uso de clases Tailwind personalizadas */}
      <Card className="bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-white">
        <CardHeader>
          <CardTitle>Card Personalizada</CardTitle>
          <CardDescription className="text-white/90">
            Puedes combinar los componentes de shadcn/ui con clases de Tailwind CSS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p>Esta card usa clases de gradiente de Tailwind CSS</p>
        </CardContent>
        <CardFooter>
          <Button variant="secondary">Acción</Button>
        </CardFooter>
      </Card>
    </div>
  )
}
