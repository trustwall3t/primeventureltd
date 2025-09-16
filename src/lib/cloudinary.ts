import { v2 as cloudinary } from 'cloudinary';

// Define the Cloudinary upload result interface
interface CloudinaryUploadResult {
	secure_url: string;
	public_id: string;
	width: number;
	height: number;
	format: string;
	resource_type: string;
	created_at: string;
	tags: string[];
	bytes: number;
	type: string;
	etag: string;
	placeholder: boolean;
	url: string;
	signature: string;
	original_filename: string;
}

cloudinary.config({
	cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadToCloudinary = async (file: File): Promise<string> => {
	try {
		// Convert file to buffer
		const bytes = await file.arrayBuffer();
		const buffer = Buffer.from(bytes);

		// Upload to Cloudinary
		const result = await new Promise<CloudinaryUploadResult>(
			(resolve, reject) => {
				cloudinary.uploader
					.upload_stream(
						{
							resource_type: 'image',
							folder: 'kyc-documents',
						},
						(error, result) => {
							if (error) {
								reject(error);
							} else {
								resolve(result as CloudinaryUploadResult);
							}
						}
					)
					.end(buffer);
			}
		);

		return result.secure_url;
	} catch (error) {
		console.error('Error uploading to Cloudinary:', error);
		throw new Error('Failed to upload image');
	}
};
