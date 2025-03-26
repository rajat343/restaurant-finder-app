import { IRestaurantCreation } from "./restaurant.interface.js";
import * as RestaurantsDataLayer from "./restaurant.datalayer.js";
import * as RestaurantCuisinesService from "../restaurantCuisines/restaurantCuisine.service.js";
import * as UsersService from "../users/user.service.js";
import axios from "axios";

export async function getRestaurants(
	findQuery = {},
	projectQuery = {},
	sortOrder = {},
	page = 1,
	limit = 10
) {
	try {
		const restaurants = await RestaurantsDataLayer.getRestaurants(
			findQuery,
			projectQuery,
			sortOrder,
			page,
			limit
		);
		return restaurants;
	} catch (err: any) {
		console.error(`error while fetching restaurants: ${err?.message}`);
		throw new Error(`error while fetching restaurants: ${err?.message}`);
	}
}

export async function getSingleRestaurant(findQuery: any, projectQuery = {}) {
	try {
		const restaurant = await RestaurantsDataLayer.getSingleRestaurant(
			findQuery,
			projectQuery
		);
		const ownerDetails = await UsersService.getSingleUser({
			_id: restaurant?.owner_id?.toString(),
		});
		return {
			restaurant,
			owner_details: ownerDetails,
		};
	} catch (err: any) {
		console.error(`error while fetching restaurant: ${err?.message}`);
		throw new Error(`error while fetching restaurant: ${err?.message}`);
	}
}

export async function createRestaurant(
	RestaurantCreationObj: IRestaurantCreation
) {
	try {
		const restaurant = await RestaurantsDataLayer.createRestaurant(
			RestaurantCreationObj
		);
		const restaurantId = restaurant?._id?.toString();
		try {
			if (RestaurantCreationObj?.cuisines?.length) {
				for (const cuisine of RestaurantCreationObj?.cuisines) {
					await RestaurantCuisinesService.createRestaurantCuisine(
						restaurantId,
						cuisine?.cuisine_id?.toString()
					);
				}
			}
		} catch (err: any) {
			console.error(
				`error while creating restaurant cuisine: ${err?.message}`
			);
			throw new Error(
				`error while creating restaurant cuisine: ${err?.message}`
			);
		}
		return restaurant;
	} catch (err: any) {
		console.error(`error while creating restaurant: ${err?.message}`);
		throw new Error(`error while creating restaurant: ${err?.message}`);
	}
}

export async function updateSingleRestaurant(findQuery: any, updateQuery: any) {
	try {
		const restaurant = await RestaurantsDataLayer.updateSingleRestaurant(
			findQuery,
			updateQuery
		);
		return restaurant;
	} catch (err: any) {
		console.error(`error while updating restaurant: ${err?.message}`);
		throw new Error(`error while updating restaurant: ${err?.message}`);
	}
}

export async function getRestruantsFromCuisine(cuisineIdArr) {
	try {
		const restaurantsFromCuisineIdArr =
			await RestaurantCuisinesService.getRestaurantsByCuisine(
				cuisineIdArr
			);
		return restaurantsFromCuisineIdArr;
	} catch (err: any) {
		console.error(
			`error while getting restaurant from cuisine id arr: ${err?.message}`
		);
		throw new Error(
			`error while getting restaurant from cuisine id arr: ${err?.message}`
		);
	}
}

export async function getUserRestruants(userId) {
	try {
		const userRestaurants = await RestaurantsDataLayer.getRestaurants({
			owner_id: userId,
			is_deleted: false,
		});
		return userRestaurants;
	} catch (err: any) {
		console.error(`error while getting user restaurants: ${err?.message}`);
		throw new Error(
			`error while getting user restaurants: ${err?.message}`
		);
	}
}

export async function getRestaurantDetailFromGoogle(placeId) {
	try {
		const GOOGLE_MAP_API_KEY = process.env.GOOGLE_MAPS_API_KEY;
		const res = await axios.get(
			`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_MAP_API_KEY}`
		);
		const restaurantDetails = res?.data;
		return restaurantDetails;
	} catch (err: any) {
		console.error(
			`error while fetching restaurant from google: ${err?.message}`
		);
		throw new Error(
			`error while fetching restaurant from google: ${err?.message}`
		);
	}
}
