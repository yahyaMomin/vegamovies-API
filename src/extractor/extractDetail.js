import { load } from 'cheerio'

export const extractDetail = (html) => {
  try {
    const $ = load(html)

    const infoContainer = $('.entry-content, .post-inner')

    const title = infoContainer
      .find('h3:contains("Download")')
      .text()
      .replace(/Download|~.*$/gi, '')
      .trim()

    // Synopsis Extraction
    const synopsis = infoContainer.find('h3:contains("SYNOPSIS/PLOT"), h4:contains("synopsis")').next('p').text().trim()
    const type = infoContainer.find('strong:contains("Series Name")').length ? 'series' : 'movie'
    // Images Extraction
    const images = []
    infoContainer.find('img').each((_, el) => {
      const imgSrc = $(el).attr('src')
      if (imgSrc) images.push(imgSrc)
    })

    // Download Links Array
    const servers = []
    infoContainer
      .find(
        // 'h3:contains("WEB-DL"), h5:contains("WEB-DL"), h5:contains("HDRip"), h5:contains("BluRay"), h3:contains("Hindi"), h3:contains("English"), h5:contains("English")'
        'h3, h5'
      )
      .filter((_, el) => {
        const text = $(el).text()
        return text.match(/\[\d+(\.\d+)?(MB|GB)(\/[A-Za-z]+)?\]/)
      })
      .each((_, el) => {
        const downloadtitle = $(el).text().trim()
        const quality =
          $(el)
            .text()
            .match(/\d+p\b/)?.[0] || '' // Extract quality (e.g., 720p)
        const size =
          $(el)
            .text()
            .match(/\[\d+(\.\d+)?(MB|GB)(\/[A-Za-z]+)?\]/)?.[0]
            ?.replace(/[\[\]]/g, '') || ''

        // Parse the associated download links
        const links = []
        $(el)
          .nextUntil('h3, h5', 'p')
          .find('a')
          .each((_, linkEl) => {
            const url = $(linkEl).attr('href')
            const serverName = $(linkEl).find('button').text().trim() || 'Unknown'

            links.push({ url, serverName })
          })
        servers.push({
          downloadtitle,
          quality,
          size,
          links,
        })
      })

    return {
      title,
      type,
      synopsis,
      images,
      servers,
    }
  } catch (error) {
    console.error('Error extracting details:', error)
    return null
  }
}
