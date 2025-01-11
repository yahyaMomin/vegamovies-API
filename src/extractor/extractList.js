import { load } from 'cheerio'

const extractItemDetails = ($, el) => {
  const idEl = $(el).find('.post-thumbnail a')
  return {
    title: idEl.find('img').attr('alt') || null || null,
    id: idEl.attr('href')?.split('/').pop() || null,
    poster: idEl.find('img').attr('src') || null,
    uploadedAt: $(el).find('.post-date .published').text() || null,
    format: $(el).find('.post-thumbnail .post-comments').text().trim() || null,
  }
}

// Extracts pagination details
const extractPaginationInfo = ($) => {
  const $pageInfo = $('.pagination')
  if ($pageInfo.length < 1)
    return {
      currentPage: 1,
      nextPage: null,
      hasNextPage: false,
    }
  return {
    currentPage: Number($pageInfo.find('.current').text()) || 1,
    nextPage: Number($pageInfo.find('.page.larger').first().text()) || null,
    hasNextPage: $pageInfo.find('.nextpostslink').length > 0,
  }
}

// Main function to extract the list and pagination details
export const extractList = (html) => {
  const $ = load(html)

  // Extract list of items
  const response = []
  $('#grid-wrapper .group.grid-item').each((_, el) => {
    response.push(extractItemDetails($, el))
  })

  // Extract pagination info
  const pageinfo = extractPaginationInfo($)

  return { pageinfo, response }
}
