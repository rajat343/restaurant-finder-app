import * as CuisinesDataLayer from "./cuisine.datalayer.js";
import { ICuisineCreation } from "./cuisine.interface.js";

export async function getCuisines(
	findQuery = {},
	projectQuery = {},
	sortOrder = {},
	page = 1,
	limit = -1
) {
	try {
		const cuisines = await CuisinesDataLayer.getCuisines(
			findQuery,
			projectQuery,
			sortOrder,
			page,
			limit
		);
		return cuisines;
	} catch (err: any) {
		console.error(`error while fetching cuisines: ${err?.message}`);
		throw new Error(`error while fetching cuisines: ${err?.message}`);
	}
}

export async function getSingleCuisine(findQuery: any, projectQuery = {}) {
	try {
		const cuisine = await CuisinesDataLayer.getSingleCuisine(
			findQuery,
			projectQuery
		);
		return cuisine;
	} catch (err: any) {
		console.error(`error while fetching cuisine: ${err?.message}`);
		throw new Error(`error while fetching cuisine: ${err?.message}`);
	}
}

export async function createCuisine(CuisineCreationObj: ICuisineCreation) {
	try {
		const cuisine = await CuisinesDataLayer.createCuisine(
			CuisineCreationObj
		);
		return cuisine;
	} catch (err: any) {
		console.error(`error while creating cuisine: ${err?.message}`);
		throw new Error(`error while creating cuisine: ${err?.message}`);
	}
}

export async function updateSingleCuisine(findQuery: any, updateQuery: any) {
	try {
		const cuisine = await CuisinesDataLayer.updateSingleCuisine(
			findQuery,
			updateQuery
		);
		return cuisine;
	} catch (err: any) {
		console.error(`error while updating cuisine: ${err?.message}`);
		throw new Error(`error while updating cuisine: ${err?.message}`);
	}
}
