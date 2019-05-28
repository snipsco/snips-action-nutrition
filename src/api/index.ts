import { http, config } from 'snips-toolkit'
import { BASE_URL } from '../constants'
const crypto = require('crypto')

export let request = http(BASE_URL)

// https://platform.fatsecret.com/api/Default.aspx?screen=rapiauth
export function computeSignature(httpMethod: string, requestURI: string, parameters): string {
    const queryString = Object.keys(parameters)
        .sort()
        .map(k => `${k}=${encodeURIComponent(parameters[k])}`)
        .join('&')

    let mac = crypto.createHmac('sha1', `${config.get().sharedSecret}&`)
    mac.update(`${httpMethod}&${encodeURIComponent(requestURI)}&${encodeURIComponent(queryString)}`)

    return mac.digest('base64')
}

export * from './searchFood'
export * from './getFood'
export * from './types'
