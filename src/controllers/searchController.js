import scraper from '../scraper/index.js'
import { createError, createResponse } from '../helper/response.js'

export const searchController = async (request, reply) => {
  try {
    const { keyword = null, page = null } = request.query

    if (!keyword) return createError(reply, 400, 'keyword is required')
    const formatedKeyword = keyword.trim().replace(/\s+/g, '+')

    const searchPage = await scraper.searchPageScraper(formatedKeyword, page)

    if (!searchPage.length < 1) return createError(reply, 400, 'something went wrong')
    return createResponse(reply, 200, searchPage)
  } catch (error) {
    return createError(reply, 500, 'internal server error' + error.message)
  }
}
