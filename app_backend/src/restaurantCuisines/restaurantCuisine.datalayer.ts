import { RestaurantCuisineModel } from "../models/restaurantCuisine.schema.js";

export async function createRestaurantCuisine(
	restaurantId: string,
	cuisineId: string
) {
	try {
		const restaurantCuisine = new RestaurantCuisineModel({
			restaurant_id: restaurantId,
			cuisine_id: cuisineId,
		});
		return await restaurantCuisine.save();
	} catch (err: any) {
		console.error(
			`error while creating restaurant cuisine: ${err?.message}`
		);
		throw new Error(
			`error while creating restaurant cuisine: ${err?.message}`
		);
	}
}

export async function getRestaurantsByCuisine(cuisineIdArr) {
	try {
		if (!Array.isArray(cuisineIdArr) || cuisineIdArr.length === 0) {
			console.error("cuisineIds must be a non-empty array");
			throw new Error("cuisineIds must be a non-empty array");
		}
		const restaurantsFromCuisineIdArr =
			await RestaurantCuisineModel.aggregate([
				// Match restaurant cuisines with the given cuisine IDs and not marked as deleted
				{
					$match: {
						cuisine_id: { $in: cuisineIdArr }, // cuisineIdArr is an array of strings
						is_deleted: false,
					},
				},
				// Convert restaurant_id from string to ObjectId
				{
					$addFields: {
						restaurant_id: { $toObjectId: "$restaurant_id" }, // Convert to ObjectId
					},
				},
				// Join with the Restaurant collection
				{
					$lookup: {
						from: "restaurants", // Collection name for Restaurant
						localField: "restaurant_id",
						foreignField: "_id",
						as: "restaurant",
					},
				},
				// Unwind the joined array to simplify structure
				{ $unwind: "$restaurant" },
				// Filter out deleted restaurants
				{
					$match: {
						"restaurant.is_deleted": false,
					},
				},
				// Extract only the restaurant data (flattened output)
				{
					$replaceRoot: { newRoot: "$restaurant" },
				},
			]);
		return restaurantsFromCuisineIdArr;
	} catch (error) {
		console.error("Error fetching restaurants by cuisine:", error);
		throw error;
	}
}
