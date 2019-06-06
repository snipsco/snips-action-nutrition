import { i18nFactory } from '../factories/i18nFactory'
import { ServingSamples } from '../handlers/common'

export const translation = {
    // Outputs an error message based on the error object, or a default message if not found.
    errorMessage: async (error: Error): Promise<string> => {
        let i18n = i18nFactory.get()

        if (!i18n) {
            await i18nFactory.init()
            i18n = i18nFactory.get()
        }

        if (i18n) {
            return i18n([`error.${error.message}`, 'error.unspecific'])
        } else {
            return 'Oops, something went wrong.'
        }
    },

    // Takes an array from the i18n and returns a random item.
    randomTranslation(key: string | string[], opts: {[key: string]: any}): string {
        const i18n = i18nFactory.get()
        const possibleValues = i18n(key, { returnObjects: true, ...opts })

        if (typeof possibleValues === 'string')
            return possibleValues

        const randomIndex = Math.floor(Math.random() * possibleValues.length)
        return possibleValues[randomIndex]
    },

    infoToSpeech(food: string, servings: ServingSamples, nutrientEntry): string {
        const i18n = i18nFactory.get()

        let tts: string = ''
        const context = nutrientEntry.unit == 'kcal' ? 'calories' : ((nutrientEntry.unit === '%') ? 'percentage' : null)

        if (servings.unit) {
            tts += i18n('nutrition.getInfo.nutritionalInfoServing', {
                amount: servings.unit[nutrientEntry.api_key],
                nutrient: i18n(`nutrients.${ nutrientEntry.api_key }`),
                food,
                unit: i18n(`units.${ nutrientEntry.unit }`),
                context
            })
            tts += ' '

            tts += i18n('nutrition.getInfo.additionalNutritionnalInfo100', {
                amount: servings.normalized[nutrientEntry.api_key],
                unit: i18n(`units.${ nutrientEntry.unit }`),
                context
            })
        } else {
            tts += i18n('nutrition.getInfo.nutritionalInfo100', {
                amount: servings.normalized[nutrientEntry.api_key],
                nutrient: i18n(`nutrients.${ nutrientEntry.api_key }`),
                food,
                unit: i18n(`units.${ nutrientEntry.unit }`),
                context
            })
        }

        return tts
    },

    compareInfoToSpeech(food1: string, servings1, food2: string, servings2, nutrientEntry): string {
        const i18n = i18nFactory.get()

        let tts: string = ''
        const servingSuffix = (servings1.unit && servings2.unit) ? 'Serving' : '100'
        const context = nutrientEntry.unit == 'kcal' ? 'calories' : ((nutrientEntry.unit === '%') ? 'percentage' : null)

        tts += i18n(`nutrition.compareInfo.comparison${ servingSuffix }`, {
            food_1: servings1.normalized[nutrientEntry.api_key] > servings2.normalized[nutrientEntry.api_key] ? food1 : food2,
            food_2: servings1.normalized[nutrientEntry.api_key] < servings2.normalized[nutrientEntry.api_key] ? food1 : food2,
            nutrient: i18n(`nutrients.${ nutrientEntry.api_key }`),
        })
        tts += ' '

        tts += i18n(`nutrition.compareInfo.nutritionalInfo${ servingSuffix }`, {
            amount_1: servings1.normalized[nutrientEntry.api_key],
            amount_2: servings2.normalized[nutrientEntry.api_key],
            nutrient: i18n(`nutrients.${ nutrientEntry.api_key }`),
            unit: i18n(`units.${ nutrientEntry.unit }`),
            food_1: food1,
            food_2: food2,
            context
        })

        return tts
    }
}
