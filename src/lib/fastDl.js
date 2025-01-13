import axios from 'axios'
import { headers } from '../services/headers.js'
import { load } from 'cheerio'

export const fastDl = async (link, ip) => {
  try {
    const vlink = await axios.get(link, {
      headers: {
        ...headers,
        'X-Forwarded-For': ip,
      },
    })
    const $vLink = load(vlink.data)

    const streamLink = []
    const url = $vLink('#vd').attr('href') || null

    if (!url) return []
    streamLink.push({ server: 'fastDl', link: url, type: 'mkv' })
    return streamLink
  } catch (error) {
    console.log('fastDl error ', error.message)
    return []
  }
}
