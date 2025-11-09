const { execSync } = require('child_process')
const fs = require('fs')
const readline = require('readline')

require('dotenv').config()

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const package = JSON.parse(fs.readFileSync('package.json'))
console.log(`📦 Versión actual: ${package.version}`)

rl.question('📝 Notas del release: ', (notes) => {
  console.log('\n🔨 Compilando TypeScript...')
  execSync('npm run build:win', { stdio: 'inherit' })

  console.log('\n📦 Creando instalador y publicando...')

  // Configurar mensaje del release
  process.env.RELEASE_NOTES = notes || 'Nueva versión'

  console.log('\n🏷️  Creando tag de git...')
  const tagName = `v${package.version}`

  try {
    // Crear tag local
    execSync(`git tag -a ${tagName} -m "${notes || 'Nueva versión'}"`, {
      stdio: 'inherit',
    })
    console.log(`✅ Tag ${tagName} creado localmente`)

    // Subir tag a GitHub
    execSync(`git push origin ${tagName}`, { stdio: 'inherit' })
    console.log(`✅ Tag ${tagName} subido a GitHub`)
  } catch (error) {
    console.error('⚠️  Error al crear o subir el tag:', error.message)
  }

  execSync('electron-builder --win --publish always', { stdio: 'inherit' })

  console.log('\n✅ Release publicado en GitHub!')
  console.log(`🔗 https://github.com/tu-usuario/tu-repositorio/releases/tag/v${package.version}`)

  rl.close()
})
