import * as RestaurantCuisinesDataLayer from "./restaurantCuisine.datalayer.js";

export async function createRestaurantCuisine(
	restaurantId: string,
	cuisineId: string
) {
	try {
		const restaurantCuisine =
			await RestaurantCuisinesDataLayer.createRestaurantCuisine(
				restaurantId,
				cuisineId
			);
		return restaurantCuisine;
	} catch (err: any) {
		console.error(
			`error while creating restaurant cuisines: ${err?.message}`
		);
		throw new Error(
			`error while creating restaurant cuisines: ${err?.message}`
		);
	}
}

export async function getRestaurantsByCuisine(cuisineIdArr) {
	try {
		const restaurantsFromCuisineIdArr =
			await RestaurantCuisinesDataLayer.getRestaurantsByCuisine(
				cuisineIdArr
			);
		return restaurantsFromCuisineIdArr;
	} catch (err: any) {
		console.error(
			`error while getting restaurants from cuisineIdArr: ${err?.message}`
		);
		throw new Error(
			`error while getting restaurants from cuisineIdArr: ${err?.message}`
		);
	}
}
