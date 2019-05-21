import { handler, ConfidenceThresholds } from 'snips-toolkit'
import { getInfoHandler } from './getInfo'
import { compareInfoHandler } from './compareInfo'
import { INTENT_PROBABILITY_THRESHOLD, ASR_UTTERANCE_CONFIDENCE_THRESHOLD } from '../constants'

const thresholds: ConfidenceThresholds = {
    intent: INTENT_PROBABILITY_THRESHOLD,
    asr: ASR_UTTERANCE_CONFIDENCE_THRESHOLD
}

// Add handlers here, and wrap them.
export default {
    getInfo: handler.wrap(getInfoHandler, thresholds),
    compareInfo: handler.wrap(compareInfoHandler, thresholds)
}
