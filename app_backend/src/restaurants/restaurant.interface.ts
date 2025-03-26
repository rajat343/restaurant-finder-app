import { RestaurantAveragePriceEnum } from "../models/restaurant.schema.js";

interface ContactInfo {
	p_n: { type: String; required: true };
	email: { type: String; required: true };
}

interface Location {
	address: string;
	zipcode: string;
	city: string;
	coordinates?: {
		lat?: number;
		lng?: number;
	};
}

interface TypeOfFood {
	is_veg?: boolean;
	is_vegan?: boolean;
	is_non_veg?: boolean;
}

export interface IRestaurantCreation {
	name: { type: String; required: true };
	description: { type: String };
	contact_info: ContactInfo;
	hours_active: String;
	owner_id: { type: String; required: true };
	cuisines?: Array<{ cuisine_id: String; cuisine_name: String }>;
	restaurant_average_price: RestaurantAveragePriceEnum;
	average_price_for_2: Number;
	location: Location;
	photos: Array<string>;
	type_of_food: TypeOfFood;
	metadata: Object;
}
