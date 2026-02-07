import { v2 as cloudnary } from "cloudinary";
import { ENV } from "./env.js";


cloudnary.config({
    cloud_name: ENV.CLOUD_NAME,
    api_key: ENV.CLOUD_API,
    api_secret: ENV.CLOUD_SECRET
})

export default cloudnary;