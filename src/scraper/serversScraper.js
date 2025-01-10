import { interceptor } from '../services/instance.js'
import axios from 'axios'
import { extractServers } from '../extractor/index.js'
import { HEADERS } from '../services/headers.js'

export const serversScraper = async (url = null) => {
  try {
    if (!url) return { status: false, message: 'url is required' }

    console.log(url)
    const { data } = await axios.get(url, {
      headers: {
        'Accept-Encoding': HEADERS.ACCEPT_ENCODING,
        'User-Agent': HEADERS.USER_AGENT,
        Cookie: HEADERS.Cookie,
      },
    })
    if (!data) return { status: false, message: 'something went wrong in serversScraper' }
    const response = extractServers(data)
    return response
  } catch (error) {
    return { status: false, message: 'internal server error ' + error.message }
  }
}
