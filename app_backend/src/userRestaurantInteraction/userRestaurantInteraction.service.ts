import * as UserRestaurantInteractionDataLayer from "./userRestaurantInteraction.datalayer.js";
import * as RestaurantService from "../restaurants/restaurant.service.js";
import * as UsersService from "../users/user.service.js";
import { IUserRestaurantInteractionUpsertQuery } from "./userRestaurantInteraction.interface.js";

export async function getUserRestaurantInteractions(
	findQuery = {},
	projectQuery = {},
	sortOrder = {},
	page = 1,
	limit = 10
) {
	try {
		let userRestaurantInteractions =
			await UserRestaurantInteractionDataLayer.getUserRestaurantInteractions(
				findQuery,
				projectQuery,
				sortOrder,
				page,
				limit
			);
		for (let userRestaurantInteraction of userRestaurantInteractions) {
			const userId = userRestaurantInteraction?.user_id?.toString();
			const user = await UsersService.getSingleUser({
				_id: userId,
			});
			userRestaurantInteraction["user_details"] = user;
			const restaurantId =
				userRestaurantInteraction?.restaurant_id?.toString();
			const restaurant = await RestaurantService.getSingleRestaurant({
				_id: restaurantId,
			});
			userRestaurantInteraction["restaurant_details"] = restaurant;
		}
		return userRestaurantInteractions;
	} catch (err: any) {
		console.error(
			`error while fetching user restaurant interaction: ${err?.message}`
		);
		throw new Error(
			`error while fetching user restaurant interaction: ${err?.message}`
		);
	}
}

export async function getUserRestaurantInteractionsFromRestaurantId(
	restaurantId
) {
	try {
		const userRestaurantInteractionsFromRestaurantId =
			await UserRestaurantInteractionDataLayer.getUserRestaurantInteractionsFromRestaurantId(
				restaurantId
			);
		return userRestaurantInteractionsFromRestaurantId;
	} catch (err: any) {
		console.error(
			`error while fetching user restaurant interaction from restaurant id: ${err?.message}`
		);
		throw new Error(
			`error while fetching user restaurant interaction from restaurant id: ${err?.message}`
		);
	}
}

export async function getUserRestaurantInteractionsFromUserId(userId) {
	try {
		const userRestaurantInteractionsFromUserId =
			await UserRestaurantInteractionDataLayer.getUserRestaurantInteractionsFromUserId(
				userId
			);
		return userRestaurantInteractionsFromUserId;
	} catch (err: any) {
		console.error(
			`error while fetching user restaurant interaction from user id: ${err?.message}`
		);
		throw new Error(
			`error while fetching user restaurant interaction from user id: ${err?.message}`
		);
	}
}

export async function giveRating(
	findQuery,
	upsertQuery: IUserRestaurantInteractionUpsertQuery
) {
	try {
		const userRestauranrInteraction =
			await UserRestaurantInteractionDataLayer.upsertUserRestaurantInteraction(
				findQuery,
				upsertQuery
			);
		return userRestauranrInteraction;
	} catch (err: any) {
		console.error(
			`error while creating user restaurant interaction: ${err?.message}`
		);
		throw new Error(
			`error while creating user restaurant interaction: ${err?.message}`
		);
	}
}

export async function getAverageRatingOfRestaurant(restaurantId) {
	try {
		const restaurantRatings =
			await UserRestaurantInteractionDataLayer.getUserRestaurantInteractions(
				{
					restaurant_id: restaurantId,
					is_deleted: false,
					rating: { $exists: true },
				}
			);
		const totalRestaurantRating = restaurantRatings.reduce(
			(sum, obj) =>
				sum + (typeof obj?.rating === "number" ? obj.rating : 0),
			0
		);
		const averageRatingOfRestaurant =
			totalRestaurantRating / restaurantRatings.length;
		return averageRatingOfRestaurant;
	} catch (err: any) {
		console.error(
			`error while fetching average rating of restaurant: ${err?.message}`
		);
		throw new Error(
			`error while fetching average rating of restaurant: ${err?.message}`
		);
	}
}
