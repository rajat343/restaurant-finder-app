import { CuisineModel } from "../models/cuisine.schema.js";
import { ICuisineCreation } from "./cuisine.interface.js";

export async function getCuisines(
	findQuery = {},
	projectQuery = {},
	sortOrder = {},
	page = 1,
	limit = 10
) {
	try {
		if (limit === -1) {
			const cuisines = await CuisineModel.find(
				findQuery,
				projectQuery
			).sort(sortOrder);
			return cuisines;
		} else {
			const skip = (page - 1) * limit;
			const cuisines = await CuisineModel.find(findQuery, projectQuery)
				.sort(sortOrder)
				.skip(skip)
				.limit(limit);
			return cuisines;
		}
	} catch (err: any) {
		console.error(`error while fetching cuisines: ${err?.message}`);
		throw new Error(`error while fetching cuisines: ${err?.message}`);
	}
}

export async function getSingleCuisine(findQuery: any, projectQuery = {}) {
	try {
		const cuisine = await CuisineModel.findOne(findQuery, projectQuery);
		return cuisine;
	} catch (err: any) {
		console.error(`error while fetching cuisine: ${err?.message}`);
		throw new Error(`error while fetching cuisine: ${err?.message}`);
	}
}

export async function createCuisine(CuisineCreationObj: ICuisineCreation) {
	try {
		const user = new CuisineModel(CuisineCreationObj);
		return await user.save();
	} catch (err: any) {
		console.error(`error while creating cuisine: ${err?.message}`);
		throw new Error(`error while creating cuisine: ${err?.message}`);
	}
}

export async function updateSingleCuisine(findQuery: any, updateQuery: any) {
	try {
		const cuisine = await CuisineModel.findOneAndUpdate(
			findQuery,
			updateQuery,
			{
				new: true,
			}
		);
		return cuisine;
	} catch (err: any) {
		console.error(`error while updating cuisine: ${err?.message}`);
		throw new Error(`error while updating cuisine: ${err?.message}`);
	}
}
