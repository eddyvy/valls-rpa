import { Browser, chromium, Page } from 'playwright'
import { GoogleSearchParams } from './types'

export async function execute(params: GoogleSearchParams): Promise<string[]> {
  const { searchTerm } = params

  console.log('🤖 Iniciando búsqueda en Google...')

  let browser: Browser | null = null

  try {
    browser = await chromium.launch({
      headless: false,
      slowMo: 100,
    })

    const page: Page = await browser.newPage()

    await page.goto('https://www.google.com', {
      waitUntil: 'networkidle',
    })

    // Aceptar cookies si aparece el banner
    try {
      await page.click('button:has-text("Aceptar todo")', { timeout: 3000 })
      console.log('✅ Cookies aceptadas')
    } catch {
      console.log('ℹ️  No apareció banner de cookies')
    }

    // Realizar búsqueda
    await page.fill('textarea[name="q"]', searchTerm)
    await page.press('textarea[name="q"]', 'Enter')

    // Esperar resultados
    await page.waitForSelector('#search', { timeout: 10000 })

    // Extraer resultados
    const resultados = await page.$$eval('h3', (elementos) =>
      elementos.slice(0, 5).map((el) => el.textContent || '')
    )

    console.log(`✅ Se encontraron ${resultados.length} resultados`)

    return resultados.filter((r) => r.length > 0)
  } catch (error) {
    console.error('Error en la búsqueda:', error)
    throw new Error(
      `Error al realizar la búsqueda: ${
        error instanceof Error ? error.message : 'Error desconocido'
      }`
    )
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}
