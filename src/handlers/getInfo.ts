import { searchFood, getFood } from '../api'
import { i18nFactory } from '../factories'
import { message } from '../utils'
import { Handler } from './index'
import { NluSlot, slotType } from 'hermes-javascript'

export const getInfoHandler: Handler = async function (msg, flow) {
    const foodIngredientSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'food_ingredient', {
        onlyMostConfident: true,
        threshold: 0.5
    })

    const nutrientSlot: NluSlot<slotType.custom> | null = message.getSlotsByName(msg, 'nutrient', {
        onlyMostConfident: true,
        threshold: 0.5
    })

    if (nutrientSlot === null) {
        throw new Error('intenNotRecognized')
    }

    // Get the food data
    const foods = await searchFood(nutrientSlot.value.value)
    const foodId = foods.foods.food[0].food_id

    const food = await getFood(foodId)
    
    if (food.food.servings) {
        console.log(food.food.servings.serving.calories)
    }

    // End the dialog session.
    flow.end()

    // Return the TTS speech.
    const i18n = i18nFactory.get()
    return 'test'
}
