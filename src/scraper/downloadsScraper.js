import { extractDownloads } from '../extractor/index.js'

export const downloadsScraper = async (url) => {
  try {
    const response = await extractDownloads(url)
    return response
  } catch (error) {
    console.log(error.message)
    return { status: false, message: error.message }
  }
}
