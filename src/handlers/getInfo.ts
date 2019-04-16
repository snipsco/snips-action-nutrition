import { slotType, NluSlot } from 'hermes-javascript'
import { searchFood, getFood } from '../api'
import { i18nFactory } from '../factories'
import { slot, logger, translation, message } from '../utils'
import { Handler } from './index'
import commonHandler, { KnownSlots } from './common'
import { tts } from '../utils'
import { utils, filterServings } from '../utils/nutrition'
import { Serving } from '../api/types'
import {
    SLOT_CONFIDENCE_THRESHOLD
} from '../constants'

export const getInfoHandler: Handler = async function (msg, flow, knownSlots: KnownSlots = { depth: 2 }) {
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
    
    try {
        // Get the food data
        const foods = await searchFood(foodIngredient)
        const food = await getFood(foods.foods.food[0].food_id)
        
        const [
            servingUnit,
            serving100
         ] = filterServings(food.food.servings.serving, foodIngredient)

         console.log(food.food.servings.serving)

        const speech = translation.infoToSpeech(foodIngredient, [ servingUnit, serving100 ], nutrientEntry)
        logger.info(speech)

        flow.end()
        if (Date.now() - now < 4000) {
            return speech
        } else {
            tts.say(speech)
        }
    } catch (error) {
        logger.error(error)
        throw new Error('APIResponse')
    }
}
