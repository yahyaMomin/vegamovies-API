import { createError, createResponse } from '../helper/response.js'
import scraper from '../scraper/index.js'

export const homeController = async (request, reply) => {
  try {
    const validQueries = [
      'home',
      'anime-series',
      'web-series',
      'chinese-series',
      'turkish-series',
      'wwe-show',
      'movies-by-genres',
      'movies-by-year',
      'movies-by-quality',
    ]
    const page = request.query.page || null
    const { query = null, category = null } = request.params

    console.log(page)

    console.log(query, category)
    if (!validQueries.includes(query)) return createError(reply, 400, 'invalid query')

    const homePage = await scraper.homePageScraper(query, category, page)

    if (homePage.length < 1) {
      return createError(reply, 404, 'page not found')
    }

    // If data is found, send a success response
    return createResponse(reply, 200, homePage)
  } catch (error) {
    return createError(reply, 500, 'internal server error' + error.message)
  }
}
