import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const uploadOnCloudinary = async (file) => {
    // Configure Cloudinary
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        // Upload file
        const result = await cloudinary.uploader.upload(file);
        
        // Delete local file after upload
        fs.unlinkSync(file);

        // Return the secure URL
        return result.secure_url;
    } catch (error) {
        fs.unlinkSync(file)
        console.log(error)
    }
};

export default uploadOnCloudinary;
