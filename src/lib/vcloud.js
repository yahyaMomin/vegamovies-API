import axios from 'axios'
import * as cheerio from 'cheerio'
import { headers } from '../services/headers.js'

export const vcloud = async (link) => {
  try {
    const baseUrl = link.split('/').slice(0, 3).join('/')
    const streamLinks = []

    // Fetch the initial page
    let vLinkText
    try {
      const vLinkRes = await axios.get(link, {
        headers: {
          ...headers,
          Referer: baseUrl,
          Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        },
      })
      vLinkText = vLinkRes.data
    } catch (error) {
      console.error('vLinkRes Error:', error.message)
      return { status: false, message: 'vLinkRes Error: ' + error.message }
    }

    // Extract redirection link
    const vLinkMatch = vLinkText.match(/var\s+url\s*=\s*'([^']+)';/)
    let vcloudLink = vLinkMatch ? vLinkMatch[1] : link
    if (vcloudLink.startsWith('/')) {
      vcloudLink = `${baseUrl}${vcloudLink}`
      console.log('New vcloudLink:', vcloudLink)
    }

    let vcloudResData
    try {
      const vcloudRes = await axios.get(vcloudLink, {
        headers,
        maxRedirects: 5,
      })
      vcloudResData = vcloudRes.data
    } catch (error) {
      console.error('vCloudRes Error:', error.message)
      return { status: false, message: 'vCloudRes Error: ' + error.message }
    }

    const $ = cheerio.load(vcloudResData)

    // Extract all potential links
    const links = $('.btn-success.btn-lg.h6, .btn-danger, .btn-secondary')
      .map((_, el) => $(el).attr('href') || '')
      .get()

    // Process each link
    await Promise.all(
      links.map(async (link) => {
        if (!link) return

        if (link.includes('.dev') && !link.includes('/?id=')) {
          streamLinks.push({ server: 'Cf Worker', link, type: 'mkv' })
        } else if (link.includes('pixel')) {
          const processedLink = processPixelLink(link)
          streamLinks.push({ server: 'Pixeldrain', link: processedLink, type: 'mkv' })
        } else if (link.includes('hubcloud') || link.includes('/?id=')) {
          const hubCloudResult = await processHubCloudLink(link, streamLinks)
          if (hubCloudResult.status === false) {
            throw new Error(hubCloudResult.message)
          }
        } else if (link.includes('cloudflarestorage')) {
          streamLinks.push({ server: 'CfStorage', link, type: 'mkv' })
        } else if (link.includes('fastdl')) {
          streamLinks.push({ server: 'FastDl', link, type: 'mkv' })
        } else if (link.includes('hubcdn')) {
          streamLinks.push({ server: 'HubCdn', link, type: 'mkv' })
        }
      })
    )

    return streamLinks
  } catch (error) {
    console.error('vCloud Error:', error.message)
    return { status: false, message: 'vCloud Error: ' + error.message }
  }
}

// Utility function to process Pixel links
const processPixelLink = (link) => {
  if (!link.includes('api')) {
    const token = link.split('/').pop()
    const baseUrl = link.split('/').slice(0, -2).join('/')
    return `${baseUrl}/api/file/${token}?download`
  }
  return link
}

const processHubCloudLink = async (link, streamLinks) => {
  try {
    const newLinkRes = await axios.get(link, { headers })
    const $newLink = cheerio.load(newLinkRes.data)
    const newLink = $newLink('#vd').attr('href') || ''
    if (newLink) {
      streamLinks.push({ server: 'HubCloud', link: newLink, type: 'mkv' })
    }
    return { status: true }
  } catch (error) {
    console.error('HubCloud Error:', error.message)
    return { status: false, message: 'HubCloud Error: ' + error.message }
  }
}
