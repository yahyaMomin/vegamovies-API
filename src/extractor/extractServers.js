import { load } from 'cheerio'
export const extractServers = (html) => {
  try {
    const $ = load(html)
    const container = $('.entry-inner')

    const response = []
    const movieTitle = $('title').text() || null
    const allh4s = container.find('h4 span').filter((i, el) => {
      return $(el).attr('style') === 'color: #993366;'
    })
    if (allh4s.length > 0) {
      allh4s.each((i, el) => {
        const obj = {
          title: null,
          downloadLinks: [],
        }
        const titleEl = $(el).find('span').text().trim() || null
        const linksEl = $(el).parent().next('p')
        obj.title = titleEl ? titleEl.replaceAll('-', '').replaceAll(':', '') : null

        linksEl.find('a').each((i, el) => {
          const serverName = $(el).text().trim()
          const link = $(el).attr('href')

          obj.downloadLinks.push({ serverName, link })
        })
        response.push(obj)
      })
    } else {
      const obj = {
        title: null,
        downloadLinks: [],
      }
      container.find('p[style="text-align: center;"] a').each((i, el) => {
        const serverName = $(el).text().trim()
        const link = $(el).attr('href')
        obj.downloadLinks.push({ serverName, link })
      })
      response.push(obj)
    }

    return { movieTitle, response }
  } catch (error) {
    console.log(error.message)
    return null
  }
}
