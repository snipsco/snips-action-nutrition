import { NUTRIENTS } from '../../constants'

export const utils = {
    getNutrientEntry(assistantKey: string) {
        for (const value of Object.values(NUTRIENTS)) {
            if (value.assistant_key === assistantKey) {
                return value
            }
        }
        return null
    }
}
