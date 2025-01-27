import { connect } from 'puppeteer-real-browser'

async function cloudflareBypass() {
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
    await page.goto('https://nopecha.com/demo')
  } catch (error) {
    console.error(error.message)
  }
}

cloudflareBypass()
export default cloudflareBypass()
