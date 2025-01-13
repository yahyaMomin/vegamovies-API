import axios from 'axios'

export const filebee = async (link) => {
  try {
    const streamLinks = []
    const filepressID = link?.split('/').pop()
    const filepressBaseUrl = link?.split('/').slice(0, -2).join('/')

    const filepressTokenRes = await axios.post(
      filepressBaseUrl + '/api/file/downlaod/',
      {
        id: filepressID,
        method: 'indexDownlaod',
        captchaValue: null,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Referer: filepressBaseUrl,
        },
      }
    )
    if (filepressTokenRes.data?.status) {
      const filepressToken = filepressTokenRes.data?.data
      const filepressStreamLink = await axios.post(
        filepressBaseUrl + '/api/file/downlaod2/',
        {
          id: filepressToken,
          method: 'indexDownlaod',
          captchaValue: null,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Referer: filepressBaseUrl,
          },
        }
      )
      // console.log('filepressStreamLink', filepressStreamLink.data);
      streamLinks.push({
        server: 'filepress',
        link: filepressStreamLink.data?.data?.[0],
        type: 'mkv',
      })
    }

    return streamLinks
  } catch (error) {
    console.log('filepress error: ', error.message)
    return []
  }
}
