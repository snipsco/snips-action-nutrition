import { httpFactory, configFactory } from '../factories'
const crypto = require('crypto')
import { logger } from '../utils'

export async function searchFood(keyword: string) {
    const config = configFactory.get()

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

    const signature = httpFactory.computeSignature('GET', httpFactory.BASE_URL, parameters)

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

    if (results && !results.hasOwnProperty('error')) {
        //logger.debug(results)
    } else {
        throw new Error('APIResponse')
    }

    return results
}
