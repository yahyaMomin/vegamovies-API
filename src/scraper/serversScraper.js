import { interceptor } from '../services/instance.js'
import axios from 'axios'
import { extractServers } from '../extractor/index.js'
import { HEADERS } from '../services/headers.js'

export const serversScraper = async (url = null) => {
  try {
    if (!url) return { status: false, message: 'url is required' }

    console.log(url)
    const obj = await axios.get(url, {
      headers: {
        'Accept-Encoding': HEADERS.ACCEPT_ENCODING,
        'User-Agent': HEADERS.USER_AGENT,
        Cookie: HEADERS.Cookie,
      },
    })
    if (!obj) return obj
    const response = extractServers(obj.data)
    return response
  } catch (error) {
    return { status: false, message: 'internal server error ' + error.message }
  }
}
