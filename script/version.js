const { execSync } = require('child_process')
const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const package = JSON.parse(fs.readFileSync('package.json'))
console.log(`📦 Versión actual: ${package.version}`)

rl.question('📝 Tipo de versión (patch/minor/major): ', (versionType) => {
  const validTypes = ['patch', 'minor', 'major']
  const type = versionType.trim().toLowerCase() || 'patch'

  if (!validTypes.includes(type)) {
    console.error('❌ Tipo de versión inválido. Usa: patch, minor o major')
    rl.close()
    process.exit(1)
  }

  console.log(`\n⬆️  Actualizando versión (${type})...`)

  // Actualizar versión en package.json
  const versionParts = package.version.split('.').map(Number)
  if (type === 'major') {
    versionParts[0]++
    versionParts[1] = 0
    versionParts[2] = 0
  } else if (type === 'minor') {
    versionParts[1]++
    versionParts[2] = 0
  } else {
    versionParts[2]++
  }

  const newVersion = versionParts.join('.')
  package.version = newVersion
  fs.writeFileSync('package.json', JSON.stringify(package, null, 2) + '\n')

  console.log(`✅ Nueva versión: ${newVersion}`)

  console.log('\n📦 Actualizando package-lock.json...')
  execSync('npm i', { stdio: 'inherit' })

  console.log('\n📝 Creando commit...')
  const commitMessage = `build: :bookmark: v${newVersion}`

  try {
    execSync('git add package.json package-lock.json', { stdio: 'inherit' })
    execSync(`git commit -m "${commitMessage}"`, { stdio: 'inherit' })
    console.log(`✅ Commit creado: "${commitMessage}"`)

    console.log('\n⬆️  Subiendo cambios a GitHub...')
    execSync('git push', { stdio: 'inherit' })
    console.log('✅ Cambios subidos a GitHub')

    console.log(`\n🎉 Versión ${newVersion} actualizada y publicada!`)
  } catch (error) {
    console.error('⚠️  Error al hacer commit o push:', error.message)
    process.exit(1)
  }

  rl.close()
})
