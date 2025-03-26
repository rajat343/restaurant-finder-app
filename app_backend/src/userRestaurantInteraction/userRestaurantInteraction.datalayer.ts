import { UserRestaurantInteractionModel } from "../models/userRestaurantInteraction.schema.js";
import { IUserRestaurantInteractionUpsertQuery } from "./userRestaurantInteraction.interface.js";

export async function getUserRestaurantInteractions(
	findQuery = {},
	projectQuery = {},
	sortOrder = {},
	page = 1,
	limit = 10
) {
	try {
		if (limit === -1) {
			const userRestaurantInteractions =
				await UserRestaurantInteractionModel.find(
					findQuery,
					projectQuery
				).sort(sortOrder);
			return userRestaurantInteractions;
		} else {
			const skip = (page - 1) * limit;
			const userRestaurantInteractions =
				await UserRestaurantInteractionModel.find(
					findQuery,
					projectQuery
				)
					.sort(sortOrder)
					.skip(skip)
					.limit(limit);
			return userRestaurantInteractions;
		}
	} catch (err: any) {
		console.error(
			`error while fetching user restaurant interactions: ${err?.message}`
		);
		throw new Error(
			`error while fetching user restaurant interactions: ${err?.message}`
		);
	}
}

export async function getUserRestaurantInteractionsFromRestaurantId(
	restaurantId
) {
	const userRestaurantInteractionsFromRestaurantId =
		await UserRestaurantInteractionModel.aggregate([
			{
				$match: {
					restaurant_id: restaurantId,
					is_deleted: false,
				},
			},
			{
				$addFields: {
					user_id_as_objectId: { $toObjectId: "$user_id" },
				},
			},
			{
				$lookup: {
					from: "users",
					localField: "user_id_as_objectId",
					foreignField: "_id",
					as: "user_details",
				},
			},
			{
				$unwind: {
					path: "$user_details",
					preserveNullAndEmptyArrays: true,
				},
			},
		]);
	return userRestaurantInteractionsFromRestaurantId;
}

export async function getUserRestaurantInteractionsFromUserId(userId) {
	const userRestaurantInteractionsFromUserId =
		await UserRestaurantInteractionModel.aggregate([
			{
				$match: {
					user_id: userId,
					is_deleted: false,
				},
			},
			{
				$addFields: {
					restaurant_id_as_objectId: {
						$toObjectId: "$restaurant_id",
					},
				},
			},
			{
				$lookup: {
					from: "restaurants",
					localField: "restaurant_id_as_objectId",
					foreignField: "_id",
					as: "restaurant_details",
				},
			},
			{
				$unwind: {
					path: "$restaurant_details",
					preserveNullAndEmptyArrays: true,
				},
			},
		]);
	return userRestaurantInteractionsFromUserId;
}

export async function getSingleUserRestaurantInteraction(
	findQuery: any,
	projectQuery = {}
) {
	try {
		const userRestaurantInteraction =
			await UserRestaurantInteractionModel.findOne(
				findQuery,
				projectQuery
			);
		return userRestaurantInteraction;
	} catch (err: any) {
		console.error(
			`error while fetching user restaurant interaction: ${err?.message}`
		);
		throw new Error(
			`error while fetching user restaurant interaction: ${err?.message}`
		);
	}
}

export async function upsertUserRestaurantInteraction(
	findQuery,
	upsertQuery: IUserRestaurantInteractionUpsertQuery
) {
	try {
		const userRestaurantInteraction =
			await UserRestaurantInteractionModel.findOneAndUpdate(
				findQuery,
				upsertQuery,
				{ new: true, upsert: true }
			).lean();
		return userRestaurantInteraction;
	} catch (err: any) {
		console.error(
			`error while creating user restaurant interaction: ${err?.message}`
		);
		throw new Error(
			`error while creating user restaurant interaction: ${err?.message}`
		);
	}
}
