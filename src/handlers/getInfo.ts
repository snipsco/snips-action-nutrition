import { searchFood, getFood } from '../api'
import { i18nFactory } from '../factories'
import { slot, logger } from '../utils'
import { Handler } from './index'
import commonHandler, { KnownSlots } from './common'

export const getInfoHandler: Handler = async function (msg, flow, knownSlots: KnownSlots = { depth: 2 }) {
    logger.info('GetInfo')

    const {
        foodIngredient,
        nutrient
    } = await commonHandler(msg, knownSlots)
    
    if (!foodIngredient || slot.missing(foodIngredient) || !nutrient || slot.missing(nutrient)) {
        throw new Error('intenNotRecognized')
    } else {
        // Get the food data
        const foods = await searchFood(foodIngredient)
        const foodId = foods.foods.food[0].food_id

        const food = await getFood(foodId)
        
        if (food.food.servings) {
            if (food.food.servings.serving[0].hasOwnProperty(nutrient)) {
                console.log(food.food.servings.serving[0][nutrient])
            }

            console.log(food.food.servings.serving[0])
        }

        // End the dialog session.
        flow.end()

        // Return the TTS speech.
        const i18n = i18nFactory.get()
        return 'test'
    }
}
