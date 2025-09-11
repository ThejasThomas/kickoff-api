import { v2 as cloudinary } from "cloudinary";
import { injectable } from "tsyringe";
import { ICloudinarySignatureService } from "../../domain/serviceInterfaces/cloudinary_service_interface";
import { config } from "../../shared/config";

@injectable()

@injectable()
export class CloudinarySignatureService implements ICloudinarySignatureService {
    generateSignature(folder: string): { timestamp: number; signature: string; folder: string; apiKey: string; cloudName: string; } {
        
        const timestamp=Math.floor(Date.now()/1000)
        const signature =cloudinary.utils.api_sign_request(
            {timestamp,folder},
            config.cloudinary.CLOUDINARY_API_SECRET!
        )
        return {
            timestamp,
            signature,
            folder,
            apiKey:config.cloudinary.CLOUDINARY_API_KEY!,
            cloudName:config.cloudinary.CLOUDINARY_CLOUD_NAME!
        }
    }


}