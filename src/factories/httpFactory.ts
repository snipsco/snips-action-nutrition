import wretch from 'wretch'
import { dedupe } from 'wretch-middlewares'
import { configFactory } from './configFactory'
import {
    LANGUAGE_MAPPINGS
} from '../constants'

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
function get() {
    return http
}

export const httpFactory = {
    init,
    get,
    BASE_URL
}
