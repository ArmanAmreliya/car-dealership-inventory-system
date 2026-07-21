import morgan from 'morgan';
import type { RequestHandler } from 'express';

const format = process.env.NODE_ENV === 'production' ? 'combined' : 'dev';

export const httpLogger: RequestHandler = morgan(format);
