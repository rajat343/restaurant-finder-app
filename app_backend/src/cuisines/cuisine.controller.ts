import { Router, Request, Response } from "express";
import * as CuisineService from "./cuisine.service.js";
import { ICuisineCreation } from "./cuisine.interface.js";
import { isUserLoggedIn } from "../middleware/auth.js";

const router = Router();

router.post("/get_cuisines", [], async (req: Request, res: Response) => {
	try {
		const findQuery = req.body.find_query || {};
		const projectQuery = req.body.project_query || {};
		const sortOrder = req.body.sort_order || { _id: -1 };
		const page = parseInt(req.body.page) || 1;
		const limit = parseInt(req.body.limit) || 10;
		const users = await CuisineService.getCuisines(
			findQuery,
			projectQuery,
			sortOrder,
			page,
			limit
		);
		res.status(200).json(users);
	} catch (err: any) {
		res.status(500).json({
			error: `Error fetching cuisines (post): ${err.message}`,
		});
	}
});

router.get("/get_cuisines", [], async (req: Request, res: Response) => {
	try {
		const findQuery = {};
		const projectQuery = {};
		const sortOrder = { _id: -1 };
		const page = parseInt(req.query.page as string) || 1;
		const limit = parseInt(req.query.limit as string) || -1;
		const users = await CuisineService.getCuisines(
			findQuery,
			projectQuery,
			sortOrder,
			page,
			limit
		);
		res.status(200).json(users);
	} catch (err: any) {
		res.status(500).json({
			error: `Error fetching cuisines (get): ${err.message}`,
		});
	}
});

router.get("/:cuisine_id", [], async (req: Request, res: Response) => {
	try {
		const cuisineId = req.params.cuisine_id;
		const cuisine = await CuisineService.getSingleCuisine({
			_id: cuisineId,
		});
		res.status(200).json(cuisine);
	} catch (err: any) {
		res.status(500).json({
			error: `Error fetching cuisine: ${err.message}`,
		});
	}
});

router.post(
	"/create_cuisine",
	[isUserLoggedIn],
	async (req: Request, res: Response) => {
		try {
			const cuisineCreationObj: ICuisineCreation = {
				name: req.body.name,
				description: req.body.description,
				image: req.body.image,
			};
			const cuisine = await CuisineService.createCuisine(
				cuisineCreationObj
			);
			res.status(201).json(cuisine);
		} catch (err: any) {
			res.status(500).json({
				error: `Error creating cuisine: ${err.message}`,
			});
		}
	}
);

router.put(
	"/update_cuisine",
	[isUserLoggedIn],
	async (req: Request, res: Response) => {
		try {
			const cuisineId = req.body.cuisine_id;
			const updateQuery = req.body.update_query;
			const updatedUser = await CuisineService.updateSingleCuisine(
				{ _id: cuisineId },
				updateQuery
			);
			res.status(201).json(updatedUser);
		} catch (err: any) {
			res.status(500).json({
				error: `Error updating cuisine: ${err.message}`,
			});
		}
	}
);

router.delete(
	"/:cuisine_id",
	[isUserLoggedIn],
	async (req: Request, res: Response) => {
		try {
			const cuisineId = req.params.cuisine_id;
			const updateQuery = {
				is_deleted: true,
			};
			const updatedCuisine = await CuisineService.updateSingleCuisine(
				{ _id: cuisineId },
				updateQuery
			);
			res.status(201).json(updatedCuisine);
		} catch (err: any) {
			res.status(500).json({
				error: `Error deleting cuisine: ${err.message}`,
			});
		}
	}
);

export default router;
