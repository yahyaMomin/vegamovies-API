import { fastDl, filebee, vcloud } from '../lib/index.js'

export const extractDownloads = async (link, ip) => {
  try {
    if (link.includes('vcloud')) {
      const streamLink = await vcloud(link, ip)
      return streamLink
    } else if (link.includes('fastdl')) {
      const streamLink = await fastDl(link, ip)
      return streamLink
    } else if (link.includes('filebee') || link.includes('filepress')) {
      const streamLink = await filebee(link, ip)
      return streamLink
    } else {
      return []
    }
  } catch (error) {
    console.log('hubcloudExtracter error: ', error)
    return []
  }
}
