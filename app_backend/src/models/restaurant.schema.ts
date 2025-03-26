import { Schema, InferSchemaType, Types, model } from "mongoose";

export enum RestaurantAveragePriceEnum {
	LOW = "LOW",
	MEDIUM = "MEDIUM",
	HIGH = "HIGH",
	PREMIUM = "PREMIUM",
}

const RestaurantSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String },
		contact_info: {
			p_n: { type: String },
			email: { type: String },
		},
		hours_active: {
			type: String,
		},
		owner_id: {
			type: String,
			required: true,
			immutable: true,
		},
		cuisines: { type: Array<{ cuisine_name: String; cuisine_id: String }> },
		restaurant_average_price: {
			type: String,
			enum: RestaurantAveragePriceEnum,
		},
		average_price_for_2: Number,
		location: {
			address: { type: String, required: true },
			zipcode: { type: String, required: true },
			city: { type: String, required: true },
			coordinates: {
				lat: { type: Number },
				lng: { type: Number },
			},
		},
		photos: { type: Array<String> },
		type_of_food: {
			is_veg: { type: Boolean },
			is_vegan: { type: Boolean },
			is_non_veg: { type: Boolean },
		},
		metadata: { type: Object },
		avg_rating: { type: Number },
		is_deleted: { type: Boolean, default: false },
	},
	{ timestamps: true }
);

RestaurantSchema.index({ owner_id: 1, is_deleted: 1 });

export type RestaurantType = Omit<
	InferSchemaType<typeof RestaurantSchema>,
	"_id"
> & {
	_id?: Types.ObjectId;
};

export const RestaurantModel = model<RestaurantType>(
	"restaurant",
	RestaurantSchema
);
