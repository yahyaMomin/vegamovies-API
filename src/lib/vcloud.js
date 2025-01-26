import * as cheerio from 'cheerio'
import { headers } from '../services/headers.js'
import fetch from 'node-fetch'
import cloudflareBypass from './cloudflareBypass.js'
export const vcloud = async (link) => {
  try {
    const baseUrl = link.split('/').slice(0, 3).join('/')
    const streamLinks = []

    const createErrorResponse = (message, error) => ({
      status: false,
      message,
      error: error?.message || error,
    })

    // Fetch the initial page
    let vLinkText

    try {
      const vLinkRes = await cloudflareBypass(link)

      if (!vLinkRes) {
        throw new Error(`HTTP Error: cloudflare Bypass failed`)
      }

      vLinkText = vLinkRes
    } catch (error) {
      console.error('vLinkRes Error:', error.message)
      return createErrorResponse('Failed to fetch the initial page.', error)
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
      const vcloudRes = await fetch(vcloudLink, {
        headers,
        redirect: 'follow',
      })

      if (!vcloudRes.ok) {
        throw new Error(`HTTP Error: ${vcloudRes.status} ${vcloudRes.statusText}`)
      }

      vcloudResData = await vcloudRes.text()
    } catch (error) {
      console.error('vCloudRes Error:', error.message)
      return createErrorResponse('Failed to fetch the vCloud link.', error)
    }

    const $ = cheerio.load(vcloudResData)

    // Extract all potential links
    const links = $('.btn-success.btn-lg.h6, .btn-danger, .btn-secondary')
      .map((_, el) => $(el).attr('href') || '')
      .get()

    // Process each link
    try {
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
    } catch (error) {
      console.error('Processing Links Error:', error.message)
      return createErrorResponse('Error while processing links.', error)
    }

    return { status: true, streamLinks }
  } catch (error) {
    console.error('vCloud Error:', error.message)
    return { status: false, message: 'Unexpected error in vCloud function.', error }
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
    const newLinkRes = await fetch(link, { headers })

    if (!newLinkRes.ok) {
      throw new Error(`HTTP Error: ${newLinkRes.status} ${newLinkRes.statusText}`)
    }

    const $newLink = cheerio.load(await newLinkRes.text())
    const newLink = $newLink('#vd').attr('href') || ''
    if (newLink) {
      streamLinks.push({ server: 'HubCloud', link: newLink, type: 'mkv' })
    }
    return { status: true }
  } catch (error) {
    console.error('HubCloud Error:', error.message)
    return {
      status: false,
      message: 'Failed to process HubCloud link.',
      error: error.message,
    }
  }
}
