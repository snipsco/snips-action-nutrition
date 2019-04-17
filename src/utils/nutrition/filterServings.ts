import { Serving } from '../../api'

export function filterServings(fullServings: Serving[], foodIngredient: string): [Serving | null, Serving] {
    const servingUnit =  fullServings.find(
        s => s.measurement_description.includes(foodIngredient) || s.measurement_description.includes('fruit')
    )
    const serving100 = fullServings.find(
        s => s.metric_serving_amount === '100.000' && s.measurement_description === 'g'
    ) || fullServings[0]

    return [ servingUnit || null, serving100 ]
}
