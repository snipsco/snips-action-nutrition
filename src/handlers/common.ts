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
    food_ingredient?: string,
    nutrient?: string
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

    let foodIngredient: string | undefined, nutrient: string | undefined

    if (!('food_ingredient' in knownSlots)) {
        const foodIngredientSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'food_ingredient', {
            onlyMostConfident: true,
            threshold: SLOT_CONFIDENCE_THRESHOLD
        })

        if (foodIngredientSlot) {
            foodIngredient = foodIngredientSlot.value.value
        }
    } else {
        foodIngredient = knownSlots.food_ingredient
    }

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

    logger.info('\tfood_ingredient: ', foodIngredient)
    logger.info('\tnutrient: ', nutrient)

    return { foodIngredient, nutrient }
}
