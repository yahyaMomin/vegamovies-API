import { extractList } from '../../extractor/extractList.js'
import { interceptor } from '../../services/instance.js'

const homePageScraper = async (query = 'home', category = null, page = 1) => {
  try {
    const constructEndpoint = (query, category, page) => {
      const base = category ? `/${query}/${category}` : `/${query}`
      return page ? `${base}/page/${page}` : base
    }

    // Generate endpoint based on query and category
    const endpoint = constructEndpoint(query, category, page)
    const homePageEndpoint = query === '/home' ? (page ? `/page/${page}` : '') : endpoint

    const obj = await interceptor(homePageEndpoint)

    if (!obj.status) return obj
    const response = extractList(obj.data)

    return response
  } catch (error) {
    return { status: false, message: error.message }
  }
}
export default homePageScraper
