import { join } from 'path'

/**
 * @type {import("puppeteer").Configuration}
 */

export default { cacheDirectory: join(__dirname, '.cache', 'puppeteer') }
