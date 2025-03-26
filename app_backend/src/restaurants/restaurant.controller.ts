import { Router, Request, Response } from "express";
import * as RestaurantService from "./restaurant.service.js";
import { IRestaurantCreation } from "./restaurant.interface.js";
import { isUserLoggedIn } from "../middleware/auth.js";

const router = Router();

router.post("/get_restaurants", [], async (req: Request, res: Response) => {
	try {
		const findQuery = req.body.find_query || {};
		const projectQuery = req.body.project_query || {};
		const sortOrder = req.body.sort_order || { _id: -1 };
		const page = parseInt(req.body.page) || 1;
		const limit = parseInt(req.body.limit) || 10;
		const restaurants = await RestaurantService.getRestaurants(
			findQuery,
			projectQuery,
			sortOrder,
			page,
			limit
		);
		res.status(200).json(restaurants);
	} catch (err: any) {
		res.status(500).json({
			error: `Error fetching restaurants (post): ${err.message}`,
		});
	}
});

router.get("/get_restaurants", [], async (req: Request, res: Response) => {
	try {
		const findQuery = { is_deleted: false };
		const projectQuery = {};
		const sortOrder = { _id: -1 };
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.page as string) || 10;
		const restaurants = await RestaurantService.getRestaurants(
			findQuery,
			projectQuery,
			sortOrder,
			page,
			limit
		);
		res.status(200).json(restaurants);
	} catch (err: any) {
		res.status(500).json({
			error: `Error fetching restaurants (get): ${err.message}`,
		});
	}
});

router.get("/get_user_restaurants", [isUserLoggedIn], async (req, res) => {
	try {
		const userId = req?.user?._id?.toString();
		const userRestaurants = await RestaurantService.getUserRestruants(
			userId
		);
		res.status(200).json(userRestaurants);
	} catch (err: any) {
		res.status(500).json({
			error: `Error while getting user restaurants: ${err.message}`,
		});
	}
});

router.get("/:restaurant_id", [], async (req: Request, res: Response) => {
	try {
		const restaurantId = req.params.restaurant_id;
		const restaurant = await RestaurantService.getSingleRestaurant({
			_id: restaurantId,
		});
		res.status(200).json(restaurant);
	} catch (err: any) {
		res.status(500).json({
			error: `Error fetching restaurant: ${err.message}`,
		});
	}
});

router.post(
	"/create_restaurant",
	[isUserLoggedIn],
	async (req, res: Response) => {
		try {
			const restaurantCreationObj: IRestaurantCreation = {
				name: req.body.name,
				description: req.body.description,
				contact_info: req.body.contact_info,
				hours_active: req.body.hours_active,
				owner_id: req?.user?._id?.toString(),
				cuisines: req.body?.cuisines,
				restaurant_average_price: req.body.restaurant_average_price,
				average_price_for_2: req.body.average_price_for_2,
				location: req.body.location,
				photos: req.body.photos,
				type_of_food: req.body.type_of_food,
				metadata: req.body.metadata,
			};
			const restaurant = await RestaurantService.createRestaurant(
				restaurantCreationObj
			);
			res.status(201).json(restaurant);
		} catch (err: any) {
			res.status(500).json({
				error: `Error creating restaurant: ${err.message}`,
			});
		}
	}
);

router.put(
	"/update_restaurant",
	[isUserLoggedIn],
	async (req: Request, res: Response) => {
		try {
			const restaurantId = req.body.restaurant_id;
			const updateQuery = req.body.update_query;
			const updatedRestaurant =
				await RestaurantService.updateSingleRestaurant(
					{ _id: restaurantId },
					updateQuery
				);
			res.status(201).json(updatedRestaurant);
		} catch (err: any) {
			res.status(500).json({
				error: `Error updating restaurant: ${err.message}`,
			});
		}
	}
);

router.delete(
	"/:restaurant_id",
	[isUserLoggedIn],
	async (req: Request, res: Response) => {
		try {
			const restaurantId = req.params.restaurant_id;
			const updateQuery = {
				is_deleted: true,
			};
			const updatedRestaurant =
				await RestaurantService.updateSingleRestaurant(
					{ _id: restaurantId },
					updateQuery
				);
			res.status(201).json(updatedRestaurant);
		} catch (err: any) {
			res.status(500).json({
				error: `Error deleting restaurant: ${err.message}`,
			});
		}
	}
);

router.post(
	"/get_restaurants_from_cuisine",
	[],
	async (req: Request, res: Response) => {
		try {
			const cuisineIdArr = req.body.cuisine_id_arr;
			const restruantsFromCuisineIdArr =
				await RestaurantService.getRestruantsFromCuisine(cuisineIdArr);
			console.log(
				"restruantsFromCuisineIdArr: ",
				restruantsFromCuisineIdArr
			);
			res.status(200).json(restruantsFromCuisineIdArr);
		} catch (err: any) {
			res.status(500).json({
				error: `Error deleting restaurant: ${err.message}`,
			});
		}
	}
);

router.get(
	"/get_restaurant_data_from_google/:place_id",
	[],
	async (req: Request, res: Response) => {
		try {
			const placeId = req.params.place_id;
			const restaurantDetails =
				await RestaurantService.getRestaurantDetailFromGoogle(placeId);
			res.status(200).json(restaurantDetails);
		} catch (err: any) {
			res.status(500).json({
				error: `Error fetching restaurant from google: ${err.message}`,
			});
		}
	}
);

export default router;
