import { httpFactory, configFactory } from '../factories'
const crypto = require('crypto')
import { logger } from '../utils'
import { GetFoodPayload } from './types'

export async function getFood(id: string): Promise<GetFoodPayload> {
    const config = configFactory.get()

    const parameters = {
        format: 'json',
        method: 'food.get',
        oauth_consumer_key: config.apiKey,
        oauth_nonce: crypto.randomBytes(10).toString('HEX'),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor((new Date()).getTime() / 1000),
        oauth_version: '1.0',
        food_id: id
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
        }) as GetFoodPayload

    if (results && !results.hasOwnProperty('error')) {
        //logger.debug(results)
    } else {
        throw new Error('APIResponse')
    }

    return results
}
