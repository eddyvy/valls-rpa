# 📁 Assets en React

## Estructura de carpetas

```
src/renderer/assets/
├── logo.png          # Logo de la aplicación
└── ...               # Otros assets (imágenes, iconos, etc.)
```

## Cómo usar assets

### 1. **Importar imágenes**

```tsx
import logo from './assets/logo.png'

function Component() {
  return <img src={logo} alt="Logo" />
}
```

### 2. **Tipos de archivos soportados**

- `.png`
- `.jpg` / `.jpeg`
- `.gif`
- `.svg`
- `.ico`

### 3. **Webpack se encarga de:**

- ✅ Copiar los assets a `dist/assets/`
- ✅ Optimizar las imágenes
- ✅ Generar nombres únicos si es necesario
- ✅ Proveer las rutas correctas

### 4. **Resultado después de compilar**

```
dist/
├── assets/
│   └── logo.png       # Webpack copia aquí automáticamente
├── index.html
└── renderer.js
```

## Agregar más assets

Simplemente coloca tus archivos en `src/renderer/assets/` e impórtalos:

```tsx
import icon1 from './assets/icon1.png'
import icon2 from './assets/icon2.svg'
import background from './assets/background.jpg'
```

## Configuración

La configuración está en `webpack.config.mjs`:

```js
{
  test: /\.(png|jpe?g|gif|svg|ico)$/i,
  type: 'asset/resource',
  generator: {
    filename: 'assets/[name][ext]',
  },
}
```

Esto asegura que todas las imágenes se copien a `dist/assets/` manteniendo sus nombres originales.
