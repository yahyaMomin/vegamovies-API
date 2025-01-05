import { load } from 'cheerio'

export const extractList = (html) => {
  const $ = load(html)
  const response = []
  $('#grid-wrapper .group.grid-item').each((i, el) => {
    const obj = {
      title: null,
      id: null,
      poster: null,
      uploadedAt: null,
      format: null,
    }
    const idEl = $(el).find('.post-thumbnail a')

    obj.format = $(el).find('.post-thumbnail .post-comments').text().trim() || null
    obj.id = idEl.attr('href').split('/').pop() || null
    obj.poster = idEl.find('img').attr('src') || null

    obj.uploadedAt = $(el).find('.post-date .published').text() || null

    obj.title = $(el).find('.post-title a').text().replace('Download', '').trim() || null

    response.push(obj)
  })

  const $pageInfo = $('.wp-pagenavi')
  const pageinfo = {
    currentPage: Number($pageInfo.find('.current').text()) || null,
    nextPage: Number($pageInfo.find('.page.larger').first().text()) || null,
    hasNextPage: $pageInfo.find('.nextpostslink').length ? true : false,
  }

  return { pageinfo, response }
}
