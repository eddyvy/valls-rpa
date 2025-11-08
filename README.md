# Valls RPA

Aplicación de escritorio para automatización de procesos robóticos con TypeScript, Electron y React.

## ✨ Características

- 🤖 Automatización de tareas con Playwright
- 🎨 Interfaz moderna con React y shadcn/ui
- 🔄 Actualizaciones automáticas
- � Aplicación de escritorio multiplataforma con Electron

## 🎨 Stack Tecnológico

- **Electron** - Framework para aplicaciones de escritorio
- **React 19** - Biblioteca para interfaces de usuario
- **TypeScript** - Superset tipado de JavaScript
- **Tailwind CSS v4** - Framework de CSS utility-first
- **shadcn/ui** - Componentes de UI accesibles y customizables
- **Playwright** - Automatización de navegadores

## �📥 Descargar

[⬇️ Descargar Valls RPA](https://github.com/eddyvy/valls-rpa/releases)

## 🚀 Instalación

1. Descarga el instalador
2. Ejecuta `Valls-RPA-Setup-X.Y.Z.exe`
3. Sigue el asistente de instalación
4. ¡Listo! La aplicación verificará automáticamente las actualizaciones

## 📋 Requisitos

- Windows 10 o superior
- 200 MB de espacio en disco

## 💻 Desarrollo

### Requisitos previos

- Node.js 18 o superior
- npm o yarn

### Instalación de dependencias

```bash
npm install
```

### Scripts disponibles

```bash
# Desarrollo
npm run dev                 # Construir y ejecutar en modo desarrollo

# Construcción
npm run build              # Construir todo el proyecto
npm run build:main         # Construir solo el proceso principal
npm run build:renderer     # Construir solo el proceso de renderizado

# Watch mode
npm run watch:main         # Vigilar cambios en el proceso principal
npm run watch:renderer     # Vigilar cambios en el proceso de renderizado

# Ejecutar
npm start                  # Iniciar la aplicación

# Generar instaladores
npm run build:win          # Generar instalador para Windows
npm run build:mac          # Generar instalador para macOS
npm run build:linux        # Generar instalador para Linux

# Linting y formato
npm run lint               # Ejecutar linter
npm run lint:fix           # Corregir problemas de linting
npm run format             # Formatear código
npm run format:check       # Verificar formato del código
```

### Estructura del proyecto

```
src/
├── main.ts                 # Proceso principal de Electron
├── preload.ts             # Script de preload
├── renderer/              # Proceso de renderizado (React)
│   ├── App.tsx           # Componente principal
│   ├── index.tsx         # Punto de entrada
│   ├── components/       # Componentes de React
│   │   ├── ui/          # Componentes de shadcn/ui
│   │   └── ...
│   ├── lib/             # Utilidades
│   ├── styles/          # Estilos globales
│   └── types/           # Types de TypeScript
└── tasks/                # Tareas de automatización
```

## 🎨 Trabajando con shadcn/ui

Este proyecto está configurado con shadcn/ui. Para más información:

- **[INICIO-RAPIDO.md](./INICIO-RAPIDO.md)** - Guía rápida de uso
- **[SHADCN-SETUP.md](./SHADCN-SETUP.md)** - Documentación completa
- **[CAMBIOS-SHADCN.md](./CAMBIOS-SHADCN.md)** - Lista de cambios realizados

### Componentes disponibles

- Button
- Card
- Input
- Label
- Dialog

Ver `src/renderer/components/ShadcnExample.tsx` para ejemplos de uso.

## 📝 Licencia

Este proyecto es privado.
