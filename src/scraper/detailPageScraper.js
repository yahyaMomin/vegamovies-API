import { extractDetail } from '../extractor/index.js'
import { interceptor } from '../services/instance.js'
export const detailPageScraper = async (id = null) => {
  try {
    const obj = await interceptor(`/${id}`)

    const response = extractDetail(obj.data)

    return response
  } catch (error) {
    return { status: false, message: error.message }
  }
}
