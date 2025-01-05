import axios from 'axios'
import { config } from '../config/config.js'

const { vegamoviesURL } = config

const HEADERS = {
  USER_AGENT: 'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  ACCEPT_ENCODING: 'gzip, deflate',
  X_REQUESTED_WITH: 'XMLHttpRequest',
}

export const axiosInstance = axios.create({
  baseURL: vegamoviesURL,
  headers: {
    'Accept-Encoding': HEADERS.ACCEPT_ENCODING,
    'User-Agent': HEADERS.USER_AGENT,
  },
})

// General error handler
const handleAxiosError = (error) => {
  if (error.response) {
    // Server responded with a status other than 2xx
    return {
      status: false,
      message: error.response.data?.message || 'Server error occurred',
      statusCode: error.response.status,
    }
  } else if (error.request) {
    // Request was made, but no response received
    return {
      status: false,
      message: 'No response from the server. Please try again later.',
    }
  } else {
    // Something else went wrong
    return {
      status: false,
      message: error.message || 'An unknown error occurred',
    }
  }
}

// Interceptor for API requests
export const interceptor = async (endpoint) => {
  console.log(endpoint)

  try {
    const { data } = await axiosInstance.get(endpoint)
    return {
      status: true,
      data,
    }
  } catch (error) {
    // Use the general error handler
    return handleAxiosError(error)
  }
}
