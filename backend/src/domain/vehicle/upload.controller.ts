import { v2 as cloudinary } from 'cloudinary';
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/authenticate';
import { env } from '../../config/env';

export class UploadController {
  getSignature = (_req: AuthenticatedRequest, res: Response, _next: NextFunction): void => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    const folder = 'dealerflow_vehicles';

    cloudinary.config({
      cloud_name: env.CLOUDINARY_CLOUD_NAME,
      api_key: env.CLOUDINARY_API_KEY,
      api_secret: env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    const paramsToSign = {
      timestamp,
      folder,
    };

    const signature = cloudinary.utils.api_sign_request(
      paramsToSign,
      env.CLOUDINARY_API_SECRET
    );

    res.status(200).json({
      signature,
      timestamp,
      apiKey: env.CLOUDINARY_API_KEY,
      cloudName: env.CLOUDINARY_CLOUD_NAME,
      folder,
    });
  };
}
