import { Request, Response, NextFunction } from 'express';
import { IAuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  login = async (_req: Request, _res: Response, _next: NextFunction): Promise<void> => {
    this.authService.login({});
    throw new Error('Not implemented');
  };

  register = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    await this.authService.register(req.body);
    res.status(501).json({ message: 'Not implemented' });
  };
}
