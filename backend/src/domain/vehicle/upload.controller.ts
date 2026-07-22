import { v2 as cloudinary } from 'cloudinary';
import type { Response, NextFunction } from 'express';
import type { AuthenticatedRequest } from '../../middleware/authenticate';
import { env } from '../../config/env';

export class UploadController {
  getSignature = (_req: AuthenticatedRequest, res: Response, _next: NextFunction): void => {
    try {
      const timestamp = Math.round(new Date().getTime() / 1000);
      const folder = 'dealerflow_vehicles';
      const cloudName = env.CLOUDINARY_CLOUD_NAME || 'dsrsmxkir';
      const apiKey = env.CLOUDINARY_API_KEY || '258713927246861';
      const apiSecret = env.CLOUDINARY_API_SECRET || 'vxbmvOi5eXqgbU7DxAAscE7WGIA';

      cloudinary.config({
        cloud_name: cloudName,
        api_key: apiKey,
        api_secret: apiSecret,
        secure: true,
      });

      const paramsToSign = {
        timestamp,
        folder,
      };

      const signature = cloudinary.utils.api_sign_request(
        paramsToSign,
        apiSecret
      );

      res.status(200).json({
        signature,
        timestamp,
        apiKey,
        cloudName,
        folder,
      });
    } catch (error: any) {
      res.status(500).json({
        status: 'error',
        message: error.message || 'Failed to generate upload signature',
      });
    }
  };
}
