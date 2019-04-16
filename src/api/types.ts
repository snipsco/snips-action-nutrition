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
    servings:           Servings;
}

export interface Servings {
    serving: Serving;
}

export interface Serving {
    calories:                   string;
    carbohydrate:               string;
    cholesterol:                string;
    fat:                        string;
    fiber:                      string;
    measurement_description:    string;
    metric_serving_amount:      string;
    metric_serving_unit:        string;
    number_of_units:            string;
    protein:                    string;
    serving_description:        string;
    serving_id:                 string;
    serving_url:                string;
    sodium:                     string;
    sugar:                      string;
    saturated_fat?:             string;
    polyunsaturated_fat?:       string;
    monounsaturated_fat?:       string;
    trans_fat?:                 string;
    potassium?:                 string;
    vitamin_a?:                 string;
    vitamin_c?:                 string;
    calcium?:                   string;
    iron?:                      string;
}

export interface SearchFoodPayload {
    foods: Foods;
}

export interface GetFoodPayload {
    food: Food;
}
