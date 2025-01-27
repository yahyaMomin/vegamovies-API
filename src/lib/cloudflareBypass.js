import { connect } from 'puppeteer-real-browser'

async function cloudflareBypass(url) {
  try {
    const response = await connect({
      headless: 'auto',
      args: [],
      customConfig: {},
      skipTarget: [],
      fingerprint: true,
      turnstile: true,
      connectOption: {},
      // Uncomment and configure the proxy settings if needed
      // proxy: {
      //     host: '<proxy-host>',
      //     port: '<proxy-port>',
      //     username: '<proxy-username>',
      //     password: '<proxy-password>'
      // }
    })

    const { browser, page } = response
    await page.goto(url, { waitUntil: 'networkidle0' })

    // Wait for user interaction (e.g., solving CAPTCHA) if necessary
    console.log('Please solve the CAPTCHA manually if it appears.')

    // Optionally, add logic to detect CAPTCHA resolution if possible

    // After CAPTCHA is solved, get the page content
    const htmlContent = await page.content()

    await browser.close()
    return htmlContent
  } catch (error) {
    console.error(error.message)
  }
}

export default cloudflareBypass
