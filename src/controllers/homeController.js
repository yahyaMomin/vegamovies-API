import { validQueries } from '../config/queries.js'
import { createError, createResponse } from '../helper/response.js'
import scraper from '../scraper/index.js'

export const homeController = async (request, reply) => {
  try {
    const { query = null, category = null } = request.params
    const page = request.query.page || null

    // Find the query in the validQueries list
    const queryRule = validQueries.find((q) => q.query === query)

    // If query is invalid, return an error
    if (!queryRule) {
      return createError(
        reply,
        400,
        `Invalid query. Supported queries are: ${validQueries.map((q) => q.query).join(', ')}`
      )
    }

    // Check if category is required but missing
    if (queryRule.categoryRequired && !category) {
      return createError(
        reply,
        400,
        `Category is required for the query: ${query} , valid Categories : ${queryRule.validCategories.join(', ')}`
      )
    }

    // Check if category is provided when not required (optional)
    if (!queryRule.categoryRequired && category) {
      return createError(reply, 400, `Category is not allowed for the query: ${query}`)
    }
    if (queryRule.categoryRequired && !queryRule.validCategories.includes(category)) {
      return createError(
        reply,
        400,
        `invalid Category {${category}} valid category is ${queryRule.validCategories.join(', ')}`
      )
    }

    // Perform scraping
    const homePage = await scraper.homePageScraper(query, category, page)

    if (homePage.length < 1) {
      return createError(reply, 404, 'Page not found')
    }

    return createResponse(reply, 200, homePage)
  } catch (error) {
    return createError(reply, 500, 'Internal server error: ' + error.message)
  }
}
