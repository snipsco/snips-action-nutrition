import { i18nFactory } from '../factories/i18nFactory'
import { Serving } from '../api/types'

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

    infoToSpeech(food: string, [ servingUnit, serving100]: (Serving | null)[], nutrientEntry): string {
        const i18n = i18nFactory.get()

        let tts: string = ''

        if (servingUnit) {
            tts += i18n('nutrition.nutritionalInfoServing', {
                amount: servingUnit[nutrientEntry.api_key],
                nutrient: nutrientEntry.value,
                food,
                unit: i18n(`units.${ nutrientEntry.unit }`),
                context: nutrientEntry.unit == 'none' ? 'no_unit' : ((nutrientEntry.unit === '%') ? 'percentage' : null)
            })
            tts += ' '
        }

        if (serving100) {
            if (servingUnit) {
                tts += i18n('nutrition.additionalNutritionnalInfo100', {
                    amount: serving100[nutrientEntry.api_key],
                    unit: i18n(`units.${ nutrientEntry.unit }`),
                    context: nutrientEntry.unit == 'none' ? 'no_unit' : ((nutrientEntry.unit === '%') ? 'percentage' : null)
                })
            } else {
                tts += i18n('nutrition.nutritionalInfo100', {
                    amount: serving100[nutrientEntry.api_key],
                    nutrient: nutrientEntry.value,
                    food,
                    unit: i18n(`units.${ nutrientEntry.unit }`),
                    context: nutrientEntry.unit == 'none' ? 'no_unit' : ((nutrientEntry.unit === '%') ? 'percentage' : null)
                })
            }
        }

        return tts
    }
}