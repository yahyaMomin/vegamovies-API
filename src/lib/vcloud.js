import axios from 'axios'
import * as cheerio from 'cheerio'
import { headers } from '../services/headers.js'
import { proxyInstance } from '../services/instance.js'

export const vcloud = async (link, ip) => {
  try {
    const baseUrl = link.split('/').slice(0, 3).join('/')
    const streamLinks = []

    // Fetch the initial page
    const vLinkRes = await axios.get(link, {
      headers: {
        ...headers,
        'X-Forwarded-For': ip,
      },
    })

    const vLinkText = vLinkRes.data

    // Extract redirection link
    const vLinkMatch = vLinkText.match(/var\s+url\s*=\s*'([^']+)';/)
    let vcloudLink = vLinkMatch ? vLinkMatch[1] : link
    if (vcloudLink.startsWith('/')) {
      vcloudLink = `${baseUrl}${vcloudLink}`
      console.log('New vcloudLink:', vcloudLink)
    }

    // Fetch the redirected page
    const vcloudRes = await axios.get(vcloudLink, {
      headers: {
        ...headers,
        'X-Forwarded-For': ip,
      },
    })
    const $ = cheerio.load(vcloudRes.data)

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
          await processHubCloudLink(link, streamLinks)
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
    console.error('vcloud Error:', error.message)
    return []
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

// Utility function to process HubCloud links
const processHubCloudLink = async (link, streamLinks) => {
  try {
    const { data: newLinkRes } = await axios.get(link, { headers })
    const $newLink = cheerio.load(newLinkRes)
    const newLink = $newLink('#vd').attr('href') || ''
    if (newLink) {
      streamLinks.push({ server: 'HubCloud', link: newLink, type: 'mkv' })
    }
  } catch (error) {
    console.error('HubCloud Extractor Error:', error.message)
  }
}
