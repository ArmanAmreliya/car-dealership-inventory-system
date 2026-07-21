import { Request, Response, NextFunction } from 'express';
import { IAuthService } from './auth.service';

export class AuthController {
  constructor(private readonly authService: IAuthService) {}

  login = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    const { email, password } = req.body as { email?: string; password?: string };
    if (!email || !password) {
      res.status(400).json({ status: 'error', message: 'Missing email or password' });
      return;
    }
    try {
      const authPayload = await this.authService.login({ email, password });
      res.status(200).json(authPayload);
    } catch {
      res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }
  };

  register = async (req: Request, res: Response, _next: NextFunction): Promise<void> => {
    await this.authService.register(req.body);
    res.status(501).json({ message: 'Not implemented' });
  };
}
