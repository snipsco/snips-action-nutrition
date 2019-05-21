import { i18n } from 'snips-toolkit'
import { ServingSamples } from '../handlers/common'

export const translation = {
    infoToSpeech(food: string, servings: ServingSamples, nutrientEntry): string {
        let tts: string = ''
        const context = nutrientEntry.unit == 'kcal' ? 'calories' : ((nutrientEntry.unit === '%') ? 'percentage' : null)

        if (servings.unit) {
            tts += i18n.translate('nutrition.getInfo.nutritionalInfoServing', {
                amount: servings.unit[nutrientEntry.api_key],
                nutrient: i18n.translate(`nutrients.${ nutrientEntry.api_key }`),
                food,
                unit: i18n.translate(`units.${ nutrientEntry.unit }`),
                context
            })

            if (servings.normalized) {
                tts += ' '
                tts += i18n('nutrition.getInfo.additionalNutritionnalInfo100', {
                    amount: servings.normalized[nutrientEntry.api_key],
                    unit: i18n(`units.${ nutrientEntry.unit }`),
                    context
                })
            }
        } else {
            if (servings.normalized) {
                tts += i18n('nutrition.getInfo.nutritionalInfo100', {
                    amount: servings.normalized[nutrientEntry.api_key],
                    nutrient: i18n(`nutrients.${ nutrientEntry.api_key }`),
                    food,
                    unit: i18n(`units.${ nutrientEntry.unit }`),
                    context
                })
            }
        }

        return tts
    },

    compareInfoToSpeech(food1: string, servings1, food2: string, servings2, nutrientEntry): string {
        let tts: string = ''
        const servingSuffix = (servings1.unit && servings2.unit) ? 'Serving' : '100'
        const context = nutrientEntry.unit == 'kcal' ? 'calories' : ((nutrientEntry.unit === '%') ? 'percentage' : null)

        tts += i18n.translate(`nutrition.compareInfo.comparison${ servingSuffix }`, {
            food_1: servings1.normalized[nutrientEntry.api_key] > servings2.normalized[nutrientEntry.api_key] ? food1 : food2,
            food_2: servings1.normalized[nutrientEntry.api_key] < servings2.normalized[nutrientEntry.api_key] ? food1 : food2,
            nutrient: i18n.translate(`nutrients.${ nutrientEntry.api_key }`),
        })
        tts += ' '

        tts += i18n.translate(`nutrition.compareInfo.nutritionalInfo${ servingSuffix }`, {
            amount_1: servings1.normalized[nutrientEntry.api_key],
            amount_2: servings2.normalized[nutrientEntry.api_key],
            nutrient: i18n.translate(`nutrients.${ nutrientEntry.api_key }`),
            unit: i18n.translate(`units.${ nutrientEntry.unit }`),
            food_1: food1,
            food_2: food2,
            context
        })

        return tts
    }
}
