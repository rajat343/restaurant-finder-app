import { RestaurantModel } from "../models/restaurant.schema.js";
import { IRestaurantCreation } from "./restaurant.interface.js";

export async function getRestaurants(
	findQuery = {},
	projectQuery = {},
	sortOrder = {},
	page = 1,
	limit = 10
) {
	try {
		if (limit === -1) {
			const restaurants = await RestaurantModel.find(
				findQuery,
				projectQuery
			).sort(sortOrder);
			return restaurants;
		} else {
			const skip = (page - 1) * limit;
			const restaurants = await RestaurantModel.find(
				findQuery,
				projectQuery
			)
				.sort(sortOrder)
				.skip(skip)
				.limit(limit);
			return restaurants;
		}
	} catch (err: any) {
		console.error(`error while fetching restaurants: ${err?.message}`);
		throw new Error(`error while fetching restaurants: ${err?.message}`);
	}
}

export async function getSingleRestaurant(findQuery: any, projectQuery = {}) {
	try {
		const restaurant = await RestaurantModel.findOne(
			findQuery,
			projectQuery
		);
		return restaurant;
	} catch (err: any) {
		console.error(`error while fetching restaurant: ${err?.message}`);
		throw new Error(`error while fetching restaurant: ${err?.message}`);
	}
}

export async function createRestaurant(
	RestaurantCreationObj: IRestaurantCreation
) {
	try {
		const restaurant = new RestaurantModel(RestaurantCreationObj);
		return await restaurant.save();
	} catch (err: any) {
		console.error(`error while creating restaurant: ${err?.message}`);
		throw new Error(`error while creating restaurant: ${err?.message}`);
	}
}

export async function updateSingleRestaurant(findQuery: any, updateQuery: any) {
	try {
		const restaurant = await RestaurantModel.findOneAndUpdate(
			findQuery,
			updateQuery,
			{
				new: true,
			}
		);
		return restaurant;
	} catch (err: any) {
		console.error(`error while updating restaurant: ${err?.message}`);
		throw new Error(`error while updating restaurant: ${err?.message}`);
	}
}
