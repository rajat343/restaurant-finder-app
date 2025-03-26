import { Schema, model, Types, InferSchemaType } from "mongoose";

export const UserRestaurantInteractionSchema = new Schema(
	{
		user_id: {
			type: String,
			required: true,
			immutable: true,
		},
		restaurant_id: {
			type: String,
			required: true,
			immutable: true,
		},
		rating: Number,
		review_photos: Array<String>,
		review: String,
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

UserRestaurantInteractionSchema.index({
	user_id: 1,
	restaurant_id: 1,
	is_deleted: 1,
});

export type UserRestaurantInteractionType = Omit<
	InferSchemaType<typeof UserRestaurantInteractionSchema>,
	"_id"
> & {
	_id?: Types.ObjectId;
};

export const UserRestaurantInteractionModel =
	model<UserRestaurantInteractionType>(
		"userrestaurantinteraction",
		UserRestaurantInteractionSchema
	);
