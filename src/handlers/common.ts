import { IntentMessage, slotType, NluSlot } from 'hermes-javascript'
import {
    message,
    logger
} from '../utils'
import {
    SLOT_CONFIDENCE_THRESHOLD,
    INTENT_PROBABILITY_THRESHOLD,
    ASR_UTTERANCE_CONFIDENCE_THRESHOLD
} from '../constants'

export type KnownSlots = {
    depth: number,
    nutrient?: string
    food_ingredient?: string,
    food_ingredients?: string[]
}

export default async function (msg: IntentMessage, knownSlots: KnownSlots) {
    if (msg.intent) {
        if (msg.intent.confidenceScore < INTENT_PROBABILITY_THRESHOLD) {
            throw new Error('intentNotRecognized')
        }
        if (message.getAsrConfidence(msg) < ASR_UTTERANCE_CONFIDENCE_THRESHOLD) {
            throw new Error('intentNotRecognized')
        }
    }

    let nutrient: string | undefined

    if (!('nutrient' in knownSlots)) {
        const nutrientSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'nutrient', {
            onlyMostConfident: true,
            threshold: SLOT_CONFIDENCE_THRESHOLD
        })

        if (nutrientSlot) {
            nutrient = nutrientSlot.value.value
        }
    } else {
        nutrient = knownSlots.nutrient
    }

    logger.info('\tnutrient: ', nutrient)

    return { nutrient }
}
