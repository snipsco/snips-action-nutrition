import { slotType, NluSlot } from 'hermes-javascript'
import { searchFood, getFood } from '../api'
import { i18nFactory } from '../factories'
import { slot, logger, translation, message } from '../utils'
import { Handler } from './index'
import commonHandler, { KnownSlots } from './common'
import { tts } from '../utils'
import { utils, filterServings } from '../utils/nutrition'
import {
    SLOT_CONFIDENCE_THRESHOLD
} from '../constants'
import { Hermes } from 'hermes-javascript'

export const getInfoHandler: Handler = async function (msg, flow, hermes: Hermes, knownSlots: KnownSlots = { depth: 2 }) {
    const i18n = i18nFactory.get()

    logger.info('GetInfo')

    const {
        nutrient,
    } = await commonHandler(msg, knownSlots)

    let foodIngredient: string | undefined

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

    logger.info('\tfood_ingredient: ', foodIngredient)
    
    if (!foodIngredient || slot.missing(foodIngredient) || !nutrient || slot.missing(nutrient)) {
        throw new Error('intentNotRecognized')
    }

    const nutrientEntry = utils.getNutrientEntry(nutrient)
    if (!nutrientEntry) {
        const speech = i18n('nutrition.dialog.unknownNutrient')
        flow.end()
        logger.info(speech)
        return speech
    }

    const now = Date.now()
    
    // Get the food data
    const foods = await searchFood(foodIngredient)
    const food = await getFood(foods.foods.food[0].food_id)
    const servings = food.food.servings.serving

    try {
        const [ foodServingUnit, foodServingNormalized ] = filterServings(servings, foodIngredient)

        const speech = translation.infoToSpeech(
            foodIngredient, { unit: foodServingUnit, normalized: foodServingNormalized }, nutrientEntry)
        logger.info(speech)

        flow.end()
        if (Date.now() - now < 4000) {
            return speech
        } else {
            tts.say(hermes, speech)
        }
    } catch (error) {
        logger.error(error)
        throw new Error('APIResponse')
    }
}
