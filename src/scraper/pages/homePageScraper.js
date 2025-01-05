import { extractList } from '../../extractor/extractList.js'
import { interceptor } from '../../services/instance.js'

const homePageScraper = async (query, category, page) => {
  try {
    const endpoint = category
      ? `${query}/${category} ${page ? `/page/${page}` : ''}`
      : `${query}${page ? `/page/${page}` : ''}`

    const homePageEndpoint = query === 'home' ? (page ? `/page/${page}` : '') : endpoint

    const obj = await interceptor(homePageEndpoint)

    if (!obj.status) return obj
    const response = extractList(obj.data)

    return response
  } catch (error) {
    return { status: false, message: error.message }
  }
}
export default homePageScraper
