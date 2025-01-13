import { extractDownloads } from '../extractor/index.js'

export const downloadsScraper = async (url, ip) => {
  try {
    const response = await extractDownloads(url, ip)
    return response
  } catch (error) {
    console.log(error.message)
    return []
  }
}
