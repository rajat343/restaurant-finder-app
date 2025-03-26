import { Router, Request, Response } from "express";
import { isUserLoggedIn } from "../middleware/auth.js";
import * as UserRestaurantInteractionService from "./userRestaurantInteraction.service.js";
import * as RestaurantService from "../restaurants/restaurant.service.js";

const router = Router();

router.post(
	"/get_user_restaurant_interactions",
	[],
	async (req: Request, res: Response) => {
		try {
			const findQuery = req.body.find_query || {};
			const projectQuery = req.body.project_query || {};
			const sortOrder = req.body.sort_order || { _id: -1 };
			const page = parseInt(req.body.page) || 1;
			const limit = parseInt(req.body.limit) || 10;
			const userRestaurantInteractions =
				await UserRestaurantInteractionService.getUserRestaurantInteractions(
					findQuery,
					projectQuery,
					sortOrder,
					page,
					limit
				);
			res.status(200).json(userRestaurantInteractions);
		} catch (err: any) {
			res.status(500).json({
				error: `Error fetching user restaurant interactions (post): ${err.message}`,
			});
		}
	}
);

router.get(
	"/get_user_restaurant_interactions_from_restaurant_id/:restaurant_id",
	[],
	async (req: Request, res: Response) => {
		try {
			const restaurantId = req.params.restaurant_id;
			const userRestaurantInteractionsFromRestaurantId =
				await UserRestaurantInteractionService.getUserRestaurantInteractionsFromRestaurantId(
					restaurantId
				);
			res.status(200).json(userRestaurantInteractionsFromRestaurantId);
		} catch (err: any) {
			res.status(500).json({
				error: `Error fetching user restaurant interactions from restaurant id: ${err.message}`,
			});
		}
	}
);

router.get(
	"/get_user_restaurant_interactions_from_user_id",
	[isUserLoggedIn],
	async (req, res) => {
		try {
			const userId = req?.user?._id?.toString();
			const userRestaurantInteractionsFromUserId =
				await UserRestaurantInteractionService.getUserRestaurantInteractionsFromUserId(
					userId
				);
			res.status(200).json(userRestaurantInteractionsFromUserId);
		} catch (err: any) {
			res.status(500).json({
				error: `Error fetching user restaurant interactions from user id: ${err.message}`,
			});
		}
	}
);

router.get(
	"/get_average_rating_of_restaurant/:restaurant_id",
	[],
	async (req, res) => {
		try {
			const restaurantId = req.params.restaurant_id;
			const averageRatingOfRestaurant =
				await UserRestaurantInteractionService.getAverageRatingOfRestaurant(
					restaurantId
				);
			res.status(200).json(averageRatingOfRestaurant);
		} catch (err: any) {
			res.status(500).json({
				error: `error while fetching average rating of restaurant: ${err.message}`,
			});
		}
	}
);

router.post("/give_rating", [isUserLoggedIn], async (req, res: Response) => {
	try {
		const restaurantId = req?.body.restaurant_id;
		const findQuery = {
			user_id: req?.user?._id?.toString(),
			restaurant_id: restaurantId,
			is_deleted: false,
		};
		const upsertQuery = req.body.upsert_query;
		const userRestaurantInteraction =
			await UserRestaurantInteractionService.giveRating(
				findQuery,
				upsertQuery
			);
		try {
			const averageRatingOfRestaurant =
				await UserRestaurantInteractionService.getAverageRatingOfRestaurant(
					restaurantId
				);
			await RestaurantService.updateSingleRestaurant(
				{
					_id: restaurantId,
					is_deleted: false,
				},
				{
					avg_rating: averageRatingOfRestaurant,
				}
			);
		} catch (err: any) {
			console.error(
				`error while updating avearge rating of restaurant: ${req?.body.restaurant_id}: ${err.message}`
			);
		}
		res.status(201).json(userRestaurantInteraction);
	} catch (err: any) {
		res.status(500).json({
			error: `Error creating user restaurant interaction: ${err.message}`,
		});
	}
});

export default router;
