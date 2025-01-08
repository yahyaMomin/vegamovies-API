import { load } from 'cheerio'

export const extractDetail = (html) => {
  try {
    const $ = load(html)

    const infoContainer = $('.entry-content, .post-inner')

    // Title Extraction
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
    const downloads = []
    infoContainer.find('h3:contains("WEB-DL"), h5:contains("WEB-DL")').each((_, el) => {
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
          const link = $(linkEl).attr('href')
          const serverName = $(linkEl).find('button').text().trim() || 'Unknown'

          downloads.push({
            title,
            quality,
            size,
            serverName,
            link,
          })
        })
    })

    return {
      title,
      synopsis,
      images,
      downloads,
    }
  } catch (error) {
    console.error('Error extracting details:', error)
    return null
  }
}
