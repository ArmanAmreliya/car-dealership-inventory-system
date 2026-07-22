import express from 'express';
import swaggerUi from 'swagger-ui-express';
import routes from '../routes/index';
import { errorHandler } from '../middleware/errorHandler';
import { httpLogger } from '../middleware/httpLogger';
import { swaggerSpec } from '../config/swagger';

const app = express();

app.use(express.json());

// Enable CORS for frontend clients
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// HTTP request logging (disabled in test to keep output clean)
if (process.env.NODE_ENV !== 'test') {
  app.use(httpLogger);
}

// API documentation
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get('/api/docs.json', (_req, res) => {
  res.json(swaggerSpec);
});

// Domain routes
app.use('/api', routes);

// Centralised error handler (must be last)
app.use(errorHandler);

export default app;
