import wretch, { Wretcher } from 'wretch'
import { configFactory } from '../factories'
import { dedupe } from 'wretch-middlewares'
const crypto = require('crypto')

const BASE_URL = 'https://platform.fatsecret.com/rest/server.api'

const http = wretch(BASE_URL)
    .middlewares([
        dedupe()
    ])

function init(httpOptions = { mock: false }) {
    wretch().polyfills({
        fetch: httpOptions.mock || require('node-fetch')
    })
}

function computeSignature(httpMethod: string, requestURI: string, parameters): string {
    const config = configFactory.get()

    const queryString = Object.keys(parameters)
        .sort()
        .map(k => `${k}=${encodeURIComponent(parameters[k])}`)
        .join('&')

    let mac = crypto.createHmac('sha1', `${config.sharedSecret}&`)
    mac.update(`${httpMethod}&${encodeURIComponent(requestURI)}&${encodeURIComponent(queryString)}`)

    return mac.digest('base64')
}

function get(): Wretcher {
    return http
}

export const httpFactory = {
    init,
    get,
    computeSignature,
    BASE_URL
}
