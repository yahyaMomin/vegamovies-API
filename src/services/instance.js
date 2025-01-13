import axios from 'axios'
import { config } from '../config/config.js'
import { headers } from './headers.js'

const { vegamoviesURL } = config

export const HEADERS = {
  USER_AGENT: 'Mozilla/5.0 (X11; Linux x86_64; rv:122.0) Gecko/20100101 Firefox/122.0',
  ACCEPT_ENCODING: 'gzip, deflate',
  X_REQUESTED_WITH: 'XMLHttpRequest',
  Cookie:
    'cf_clearance=aRS3LWXOAJ1ytgefovjwF6QifPxy.QrCOKVAnHbOKgE-1736159304-1.2.1.1-xpTP7OIW8r9kwuw8a4CDn2ngMn5Sy_P1RpnQXSHfkufZc.oClEE.VSAXWPEK1z3oztEZWxKlQM71k7_hiJPj7xq4fCcP4gOxaTkm5zqy4DFfg.c7dtXsRqNYEz9imYexByNJsoVh9p0c1GDiEjH_t0HpBWHYLSpBC1m8DERRl.3HTGGO9ePVe9EPmBIgqZMTUlnm8t2K7UxDTJIiqn7_TrT.Ai2Z9q1SU9eYyD.hlyZLw2YC1F09k4sUjWcWxhr6G6BTr8Me787mnQsDZBZrkpvciF5hKv6qIh_2J5sD.3wogG7mt4C5SQ4kQi8z6kxJGxlgjXVj8CSb06pMdSRCidi7dmGdODBF5WkMg_8uATs',
}

export const axiosInstance = axios.create({
  baseURL: vegamoviesURL,
  headers,
})
export const proxyInstance = axios.create({
  headers,
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
  console.log(vegamoviesURL + endpoint)

  try {
    const { data } = await axiosInstance.get(endpoint)

    return {
      status: true,
      data,
    }
  } catch (error) {
    console.log(error.message)
    return handleAxiosError(error)
  }
}
