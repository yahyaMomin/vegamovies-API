import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

const stealth = StealthPlugin()
stealth.enabledEvasions.add('chrome.app')
puppeteer.use(stealth)

const cloudflareBypass = async (url) => {
  try {
    const browser = await puppeteer.launch({
      headless: 'new', // Enable faster headless mode
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu', // Disable GPU for faster rendering
        '--disable-dev-shm-usage', // Avoid resource constraints
        '--single-process', // Run in a single process to speed up
        '--no-zygote',
        '--disable-background-networking', // Disable unnecessary network activity
        '--enable-features=NetworkService',
        '--disable-features=site-per-process',
      ],
    })

    const page = await browser.newPage()

    // Use minimal viewport to reduce rendering overhead
    await page.setViewport({ width: 800, height: 600 })

    // Disable unnecessary assets (e.g., images, stylesheets, etc.)
    await page.setRequestInterception(true)
    page.on('request', (req) => {
      const resourceType = req.resourceType()
      if (['image', 'stylesheet', 'font', 'media', 'other'].includes(resourceType)) {
        req.abort()
      } else {
        req.continue()
      }
    })

    // Navigate to the Cloudflare-protected page
    const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 })
    if (!response.ok()) {
      throw new Error(`Failed to load page: ${response.status()} ${response.statusText()}`)
    }

    // Wait for the Cloudflare challenge to pass or the main content to load
    await page.waitForSelector('body', { timeout: 15000 })

    // Extract the HTML of the page
    const html = await page.content()

    await browser.close()
    return html
  } catch (error) {
    console.error('Cloudflare Bypass Error:', error.message)
    return null
  }
}

export default cloudflareBypass
