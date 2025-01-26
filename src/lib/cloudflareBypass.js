import puppeteer from 'puppeteer-extra'
import StealthPlugin from 'puppeteer-extra-plugin-stealth'

puppeteer.use(StealthPlugin())

const cloudflareBypass = async (url) => {
  try {
    const browser = await puppeteer.launch({
      headless: false, // Use headless mode for efficiency
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    })

    const page = await browser.newPage()

    // Go to the Cloudflare-protected website
    await page.goto(url, { waitUntil: 'networkidle2' })

    // Wait for a selector that only appears after Cloudflare's challenge passes
    await page.waitForSelector('body') // Change this to an actual element that appears after Cloudflare challenge

    // Extract the HTML of the page
    const html = await page.content() // Returns the full HTML content

    await browser.close()
    return html
  } catch (error) {
    console.error('Cloudflare Bypass Error:', error.message)
    return null
  }
}

export default cloudflareBypass
