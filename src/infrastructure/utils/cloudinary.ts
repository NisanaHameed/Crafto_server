import { v2 } from "cloudinary";
import ICloudinary from "../../use_case/interface/ICloudinary";

v2.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_KEY,
    api_secret:process.env.CLOUD_SECRET
});

class Cloudinary implements ICloudinary {
    async uploadToCloud(file: any): Promise<string> {
        const result = await v2.uploader.upload(file?.path)
        return result.secure_url;
    }
}
export default Cloudinary;