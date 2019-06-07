import { Serving } from '../../api'

export function filterServings(fullServing: Serving[] | Serving, foodIngredient: string): [Serving | null, Serving | null] {
    let fullServings = (Array.isArray(fullServing)) ? fullServing : [ fullServing ]

    const servingUnit = fullServings.find(
        s => s.measurement_description.includes(foodIngredient) || s.measurement_description.includes('fruit') || s.measurement_description.includes('serving')
    )
    const serving100 = fullServings.find(
        s => s.metric_serving_amount === '100.000' && s.measurement_description === 'g'
    )

    return [ servingUnit || null, serving100 || null ]
}
