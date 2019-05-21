import { logger, config } from 'snips-toolkit'
import { GetFoodPayload } from './types'
import { BASE_URL } from '../constants'
import { computeSignature, request } from './index'
const crypto = require('crypto')

export async function getFood(id: string): Promise<GetFoodPayload> {
    const parameters = {
        format: 'json',
        method: 'food.get',
        oauth_consumer_key: config.get().apiKey,
        oauth_nonce: crypto.randomBytes(10).toString('HEX'),
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor((new Date()).getTime() / 1000),
        oauth_version: '1.0',
        food_id: id
    }

    const signature = computeSignature('GET', BASE_URL, parameters)

    const results = await request
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
