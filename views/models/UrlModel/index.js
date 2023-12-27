import { SAFE_URL_PATTERN, DATA_URL_PATTERN } from '../../../constants'

const UrlModel = {
  sanitizeUrl: (url) => {
    url = String(url)

    if (url.match(SAFE_URL_PATTERN) || url.match(DATA_URL_PATTERN)) return url

    return `data:,Unsafe%20Image`
  },
}

export default UrlModel
