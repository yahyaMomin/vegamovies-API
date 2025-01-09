import { createError, createResponse } from '../helper/response.js'
import scraper from '../scraper/index.js'

export const detailController = async (request, reply) => {
  try {
    const { id } = request.query
    if (!id) return createError(reply, 400, 'id is required')

    console.log(id)

    const detailPage = await scraper.detailPageScraper(id)

    return createResponse(reply, 200, detailPage)
  } catch (error) {
    return createError(reply, 500, 'internal server error at detailPage' + error.message)
  }
}
