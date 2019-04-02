import { httpFactory, configFactory } from '../factories'
import { HmacSha1 } from 'hmac_sha1'
const crypto = require('crypto')
import { logger } from '../utils'

export async function searchFood(keyword: string) {
    const config = configFactory.get()

    const httpMethod = "GET"
    const requestURI = encodeURIComponent(httpFactory.BASE_URL)

    const parameters = {
        format: 'json',
        method: 'foods.search',
        oauth_consumer_key: config.apiKey,
        oauth_nonce: crypto.randomBytes(10).toString('HEX'),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor((new Date()).getTime() / 1000),
        oauth_version: '1.0',
        search_expression: keyword
    }

    const queryString = encodeURIComponent(Object.keys(parameters)
        .sort()
        .map(k => `${k}=${encodeURIComponent(parameters[k])}`)
        .join('&'))

    let mac = crypto.createHmac('sha1', `${config.sharedSecret}&`)
    mac.update(`${httpMethod}&${requestURI}&${queryString}`)

    const signature = encodeURIComponent(mac.digest('base64'))

    const results = await httpFactory.get()
        .query({
            ...parameters,
            oauth_signature: signature
        })
        .get()
        .json()
        .catch(error => {
            logger.error(error)
            // Network error
            if (error.name === 'TypeError')
                throw new Error('APIRequest')
            // Other error
            throw new Error('APIResponse')
        })

    if (results/* && !results.hasOwnProperty('error')*/) {
        logger.debug(results)
    } else {
        throw new Error('APIResponse')
    }

    return results
}
