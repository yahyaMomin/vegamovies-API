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
    const synopsis = infoContainer.find('h3:contains("SYNOPSIS/PLOT")').next('p').text().trim()

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
        'h3:contains("WEB-DL"), h5:contains("WEB-DL"), h5:contains("HDRip"), h5:contains("BluRay"), h5:contains("{Hindi")'
      )
      .each((_, el) => {
        const downloadtitle = $(el).text().trim()
        const quality =
          $(el)
            .text()
            .match(/\d+p\b/)?.[0] || '' // Extract quality (e.g., 720p)
        const size =
          $(el)
            .text()
            .match(/\[\d+(MB|GB)\]/)?.[0]
            ?.replace(/[\[\]]/g, '') || '' // Extract size

        // Parse the associated download links
        $(el)
          .nextUntil('h3, h5', 'p')
          .find('a')
          .each((_, linkEl) => {
            const url = $(linkEl).attr('href')
            const serverName = $(linkEl).find('button').text().trim() || 'Unknown'

            servers.push({
              downloadtitle,
              quality,
              size,
              serverName,
              url,
            })
          })
      })

    return {
      title,
      synopsis,
      images,
      servers,
    }
  } catch (error) {
    console.error('Error extracting details:', error)
    return null
  }
}
