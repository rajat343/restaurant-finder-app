import { Schema, model, Types, InferSchemaType } from "mongoose";

const CuisineSchema: Schema = new Schema(
	{
		name: { type: String, required: true },
		description: { type: String, required: true },
		image: { type: String, required: true },
		is_deleted: { type: Boolean, default: false },
	},
	{
		timestamps: true,
	}
);

export type CuisineType = Omit<InferSchemaType<typeof CuisineSchema>, "_id"> & {
	_id?: Types.ObjectId;
};

export const CuisineModel = model<CuisineType>("cuisine", CuisineSchema);
