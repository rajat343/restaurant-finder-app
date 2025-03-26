import "../config/envLoader.js";
import { Router } from "express";
import multer from "multer";
import AWS from "aws-sdk";
import { isUserLoggedIn } from "../middleware/auth.js";

const s3 = new AWS.S3({
	accessKeyId: process.env.AWS_ACCESS_KEY_ID,
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
	region: process.env.AWS_REGION,
});

const storage = multer.memoryStorage();
const upload = multer({
	storage,
	// Accept any file type without restrictions
	fileFilter: (req, file, cb) => {
		cb(null, true);
	},
});

const router = Router();

// Upload Route
router.post("", [upload.array("files"), isUserLoggedIn], async (req, res) => {
	try {
		if (!req.files) {
			return res.status(400).send({ message: "No file(s) uploaded!" });
		}
		const userId = req.user._id?.toString();
		if (!userId) {
			return res.status(400).send({
				message: "User needs to be logged in to upload!",
			});
		}
		const folderName = req.body.folder_name;
		if (!folderName) {
			return res.status(400).send({
				message: "Folder name is required!",
			});
		}
		// Upload to S3
		const uploadResults: { fileName: string; url: string }[] = [];
		for (const file of req.files) {
			const customFileName = `${userId}_${Date.now()}_${
				file.originalname
			}`;
			const uploadParams = {
				Bucket: process.env.AWS_S3_BUCKET_NAME as string,
				Key: `${folderName}/${customFileName}`,
				Body: file.buffer,

			};
			const data = await s3.upload(uploadParams).promise();
			let uploadObj = {
				fileName: file.originalname,
				url: data.Location,
			};
			uploadResults.push(uploadObj);
		}
		res.status(200).send({
			message: "Files uploaded successfully!",
			files: uploadResults,
		});
	} catch (err) {
		console.error("Error uploading file:", err);
		res.status(500).send({ message: "File upload failed!", err });
	}
});

export default router;
