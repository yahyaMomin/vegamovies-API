import axios from 'axios'
import * as cheerio from 'cheerio'
import { headers } from '../services/headers.js'

export const vcloud = async (link, ip) => {
  try {
    const baseUrl = link.split('/').slice(0, 3).join('/')
    const streamLinks = []

    // Fetch the initial page
    const vLinkRes = await axios.get(link, {
      headers: {
        ...headers,
        'X-Forwarded-For': ip || '127.0.0.1',
        Referer: baseUrl,
        Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      },
    })
    console.log('Response Status:', vLinkRes.status)
    console.log('Response Headers:', vLinkRes.headers)

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
      headers,
      maxRedirects: 5, // Ensure redirects are followed
    })
    const $ = cheerio.load(vcloudRes.data)
    console.log('vcloud response ', vcloudRes.status)
    console.log('vcloud response headers', vcloudRes.headers)

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
    console.log(error)
    return { status: false, message: error.message }
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
  } catch (error) {
    console.error('HubCloud Extractor Error:', error.message)
    return { status: false, message: error.message }
  }
}
