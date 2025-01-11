import { fastDl, filebee, vcloud } from '../lib/index.js'

export const extractDownloads = async (link) => {
  try {
    if (link.includes('vcloud')) {
      const streamLink = await vcloud(link)
      return streamLink
    } else if (link.includes('fastdl')) {
      const streamLink = await fastDl(link)
      return streamLink
    } else if (link.includes('filebee')) {
      const streamLink = await filebee(link)
      return streamLink
    } else {
      return []
    }
  } catch (error) {
    console.log('hubcloudExtracter error: ', error)
    return []
  }
}
