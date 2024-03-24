import { v2 } from "cloudinary";
import ICloudinary from "../../use_case/interface/ICloudinary";

v2.config({
    cloud_name:process.env.cloud_name,
    api_key:process.env.cloud_key,
    api_secret:process.env.cloud_secret
});

class Cloudinary implements ICloudinary {
    async uploadToCloud(file: any): Promise<string> {
        const result = await v2.uploader.upload(file?.path)
        return result.secure_url;
    }
}
export default Cloudinary;