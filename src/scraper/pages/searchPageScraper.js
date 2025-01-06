import { extractList } from '../../extractor/extractList.js'
import { interceptor } from '../../services/instance.js'

const searchPageScraper = async (keyword = null, page = null) => {
  try {
    const endpoint = page ? `/page/${page}?s=${keyword}` : `/?s=${keyword}`

    const obj = await interceptor(endpoint)

    if (!obj.status) return obj
    const response = extractList(obj.data)

    return response
  } catch (error) {
    return { status: false, message: error.message }
  }
}
export default searchPageScraper
