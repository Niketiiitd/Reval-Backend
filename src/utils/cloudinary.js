import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadOnCloudinary = async (base64Image) => {
    try {
        if (!base64Image) return null;
        
        const result = await cloudinary.uploader.upload(`data:image/jpeg;base64,${base64Image}`, {
            resource_type: "auto"
        });
        return result;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};

export { uploadOnCloudinary };