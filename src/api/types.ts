export interface Foods {
    food:          Food[];
    max_results:   string;
    page_number:   string;
    total_results: string;
}

export interface Food {
    brand_name:         string;
    food_description?:  string;
    food_id:            string;
    food_name:          string;
    food_type:          string;
    food_url:           string;
    servings?:          Servings;
}

export interface Servings {
    serving: Serving;
}

export interface Serving {
    calories:                string;
    carbohydrate:            string;
    cholesterol:             string;
    fat:                     string;
    fiber:                   string;
    measurement_description: string;
    metric_serving_amount:   string;
    metric_serving_unit:     string;
    number_of_units:         string;
    protein:                 string;
    serving_description:     string;
    serving_id:              string;
    serving_url:             string;
    sodium:                  string;
    sugar:                   string;
}

export interface SearchFoodPayload {
    foods: Foods;
}

export interface GetFoodPayload {
    food: Food;
}
