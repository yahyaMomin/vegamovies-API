import { createError, createResponse } from '../helper/response.js'
import scraper from '../scraper/index.js'

const links = {
  gdirect: 'https://fastdl.icu/embed?download=ROIYFcAlsprACMb4sIZXJNw0T',
  vCloud: 'https://vcloud.lol/bunop-m-pmk1-nd',
  filepress: 'https://filebee.xyz/file/67822d0043d525f43b36538a',
  gdtot: 'https://new10.gdtot.dad/file/1174370496',
  dropProxy: 'https://dgdrive.pro/nzizv4a93lix',
}
scraper.downloadsScraper(links.filepress)
export const downloadsController = async (request, reply) => {
  try {
    const { url } = request.query

    const userIp = request.headers['x-forwarded-for'] || request.ip

    if (!url) return createError(reply, 404, 'url is required')

    const donwloads = await scraper.downloadsScraper(url, userIp)
    if (donwloads.status === false) return reply.status(400).send(donwloads)
    // if (donwloads.status === false) return createError(reply, 400, donwloads.message)
    return createResponse(reply, 200, donwloads)
  } catch (error) {
    return createError(reply, 500, 'internal server Error ' + error.message)
  }
}
