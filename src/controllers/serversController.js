import { createError, createResponse } from '../helper/response.js'
import scraper from '../scraper/index.js'

const link = 'https://nexdrive.lol/genxfm78477617020/'
scraper.serversScraper(link)
export const serversController = async (request, reply) => {
  try {
    const { url } = request.query
    if (!url) return createError(reply, 404, 'url is required')

    const servers = await scraper.serversScraper(url)
    if (!servers) return createError(reply, 400, 'url maybe incorrect')
    return createResponse(reply, 200, servers)
  } catch (error) {
    return createError(reply, 500, 'error in videoController ' + error.message)
  }
}
