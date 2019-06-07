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

export const compareInfoHandler: Handler = async function (msg, flow, hermes: Hermes, knownSlots: KnownSlots = { depth: 2 }) {
    const i18n = i18nFactory.get()

    logger.info('CompareInfo')

    const {
        nutrient
    } = await commonHandler(msg, knownSlots)

    let foodIngredients: string[] | undefined

    if (!('food_ingredients' in knownSlots)) {
        const foodIngredientsSlot: NluSlot<slotType.custom>[] | null = message.getSlotsByName(msg, 'food_ingredient', {
            threshold: SLOT_CONFIDENCE_THRESHOLD
        })

        if (foodIngredientsSlot) {
            foodIngredients = foodIngredientsSlot.map(x => x.value.value)
        }
    } else {
        foodIngredients = knownSlots.food_ingredients
    }

    logger.info('\tfood_ingredients: ', foodIngredients)

    if (!foodIngredients || slot.missing(foodIngredients) || !nutrient || slot.missing(nutrient)) {
        throw new Error('intentNotRecognized')
    }
    if (foodIngredients.length < 2) {
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
    const foods1 = await searchFood(foodIngredients[0])
    const food1 = await getFood(foods1.foods.food[0].food_id)
    const servings1 = food1.food.servings.serving

    const foods2 = await searchFood(foodIngredients[1])
    const food2 = await getFood(foods2.foods.food[0].food_id)
    const servings2 = food2.food.servings.serving

    try {
        const [ food1ServingUnit, food1ServingNormalized ] = filterServings(servings1, foodIngredients[0])
        if (!food1ServingUnit && !food1ServingNormalized) {
            const speech = i18n('nutrition.dialog.unknownInfo')
            flow.end()
            logger.info(speech)
            return speech
        }

        const [ food2ServingUnit, food2ServingNormalized ] = filterServings(servings2, foodIngredients[0])
        if (!food2ServingUnit && !food2ServingNormalized) {
            const speech = i18n('nutrition.dialog.unknownInfo')
            flow.end()
            logger.info(speech)
            return speech
        }

        const speech = translation.compareInfoToSpeech(
            foodIngredients[0], { unit: food1ServingUnit, normalized: food1ServingNormalized },
            foodIngredients[1], { unit: food2ServingUnit, normalized: food2ServingNormalized }, nutrientEntry)
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
