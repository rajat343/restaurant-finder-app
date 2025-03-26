import { Schema, model, Types, InferSchemaType } from "mongoose";

const RestaurantCuisineSchema: Schema = new Schema(
	{
		restaurant_id: {
			type: String,
			required: true,
			immutable: true,
		},
		cuisine_id: {
			type: String,
			required: true,
			immutable: true,
		},
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

export type RestaurantCuisineType = Omit<
	InferSchemaType<typeof RestaurantCuisineSchema>,
	"_id"
> & {
	_id?: Types.ObjectId;
};

export const RestaurantCuisineModel = model<RestaurantCuisineType>(
	"restaurantcuisine",
	RestaurantCuisineSchema
);
