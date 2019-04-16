import { searchFood, getFood } from '../api'
import { i18nFactory } from '../factories'
import { slot, logger, translation } from '../utils'
import { Handler } from './index'
import commonHandler, { KnownSlots } from './common'
import { tts } from '../utils'
import { utils } from '../utils/nutrition'

export const getInfoHandler: Handler = async function (msg, flow, knownSlots: KnownSlots = { depth: 2 }) {
    const i18n = i18nFactory.get()

    logger.info('GetInfo')

    const {
        foodIngredient,
        nutrient
    } = await commonHandler(msg, knownSlots)
    
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
    const foodId = foods.foods.food[0].food_id

    const food = await getFood(foodId)
    
    try {
        const serving = food.food.servings.serving[0]

        const speech = translation.infoToSpeech(foodIngredient, serving, nutrientEntry)
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
