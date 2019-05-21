import { IntentMessage, slotType, NluSlot } from 'hermes-javascript/types'
import { message, logger } from 'snips-toolkit'
import { SLOT_CONFIDENCE_THRESHOLD } from '../constants'
import { Serving } from '../api'

export type KnownSlots = {
    depth: number,
    nutrient?: string
    food_ingredient?: string,
    food_ingredients?: string[]
}

export type ServingSamples = {
    unit: Serving | null,
    normalized: Serving | null
}

export default async function (msg: IntentMessage, knownSlots: KnownSlots) {
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
