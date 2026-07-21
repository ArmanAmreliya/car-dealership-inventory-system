import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'DealerFlow API',
      version: '1.0.0',
      description:
        'Car Dealership Inventory Management System REST API. ' +
        'All protected endpoints require a Bearer JWT token obtained from POST /api/v1/auth/login.',
    },
    servers: [{ url: '/api', description: 'Current host' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ErrorResponse: {
          type: 'object',
          properties: {
            status: { type: 'string', example: 'error' },
            message: { type: 'string' },
          },
        },
        Vehicle: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'integer' },
            price: { type: 'number' },
            vin: { type: 'string' },
            mileage: { type: 'integer' },
            color: { type: 'string' },
            isAvailable: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        CreateVehicleBody: {
          type: 'object',
          required: ['make', 'model', 'year', 'price', 'vin'],
          properties: {
            make: { type: 'string', example: 'Toyota' },
            model: { type: 'string', example: 'Camry' },
            year: { type: 'integer', example: 2024 },
            price: { type: 'number', example: 28000 },
            vin: { type: 'string', example: '1HGBH41JXMN109186' },
            mileage: { type: 'integer', example: 0 },
            color: { type: 'string', example: 'White' },
          },
        },
        UpdateVehicleBody: {
          type: 'object',
          properties: {
            make: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'integer' },
            price: { type: 'number' },
            mileage: { type: 'integer' },
            color: { type: 'string' },
            isAvailable: { type: 'boolean' },
          },
        },
        InventoryStatus: {
          type: 'object',
          properties: {
            totalVehicles: { type: 'integer' },
            availableVehicles: { type: 'integer' },
            unavailableVehicles: { type: 'integer' },
            items: {
              type: 'array',
              items: { $ref: '#/components/schemas/InventoryItem' },
            },
          },
        },
        InventoryItem: {
          type: 'object',
          properties: {
            vehicleId: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'integer' },
            vin: { type: 'string' },
            price: { type: 'number' },
            stockQuantity: { type: 'integer' },
            isAvailable: { type: 'boolean' },
          },
        },
        StockUpdateBody: {
          type: 'object',
          required: ['stockQuantity'],
          properties: {
            stockQuantity: { type: 'integer', minimum: 0, example: 1 },
          },
        },
        PurchaseBody: {
          type: 'object',
          required: ['vehicleId'],
          properties: {
            vehicleId: { type: 'string', example: 'vehicle-1' },
          },
        },
        PurchaseRecord: {
          type: 'object',
          properties: {
            purchaseId: { type: 'string', format: 'uuid' },
            vehicleId: { type: 'string' },
            make: { type: 'string' },
            model: { type: 'string' },
            year: { type: 'integer' },
            vin: { type: 'string' },
            price: { type: 'number' },
            purchasedAt: { type: 'string', format: 'date-time' },
          },
        },
        RegisterBody: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: { type: 'string', example: 'Jane Doe' },
            email: { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', minLength: 8, example: 'password123' },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'string' },
                email: { type: 'string' },
                name: { type: 'string', nullable: true },
                role: { type: 'string' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      '/v1/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register a new user',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } } },
          },
          responses: {
            201: {
              description: 'User registered',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
            },
            400: { description: 'Validation error', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            409: { description: 'Email already registered', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/v1/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login and obtain a JWT',
          security: [],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } },
          },
          responses: {
            200: {
              description: 'Successful login',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } },
            },
            400: { description: 'Missing credentials' },
            401: { description: 'Invalid credentials' },
          },
        },
      },
      '/v1/vehicles': {
        post: {
          tags: ['Vehicles'],
          summary: 'Create a vehicle',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateVehicleBody' } } },
          },
          responses: {
            201: { description: 'Vehicle created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Vehicle' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
        get: {
          tags: ['Vehicles'],
          summary: 'List all vehicles',
          parameters: [
            { in: 'query', name: 'make', schema: { type: 'string' } },
            { in: 'query', name: 'model', schema: { type: 'string' } },
            { in: 'query', name: 'year', schema: { type: 'integer' } },
            { in: 'query', name: 'availability', schema: { type: 'boolean' } },
            { in: 'query', name: 'minPrice', schema: { type: 'number' } },
            { in: 'query', name: 'maxPrice', schema: { type: 'number' } },
          ],
          responses: {
            200: {
              description: 'Array of vehicles',
              content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Vehicle' } } } },
            },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/v1/vehicles/{id}': {
        get: {
          tags: ['Vehicles'],
          summary: 'Get a vehicle by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            200: { description: 'Vehicle found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Vehicle' } } } },
            401: { description: 'Unauthorized' },
            404: { description: 'Not found' },
          },
        },
        put: {
          tags: ['Vehicles'],
          summary: 'Update a vehicle',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateVehicleBody' } } },
          },
          responses: {
            200: { description: 'Vehicle updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Vehicle' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Vehicles'],
          summary: 'Delete a vehicle',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          responses: {
            204: { description: 'Deleted' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not found' },
          },
        },
      },
      '/v1/inventory': {
        get: {
          tags: ['Inventory'],
          summary: 'Get current inventory status',
          responses: {
            200: { description: 'Inventory status', content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryStatus' } } } },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/v1/inventory/{id}': {
        patch: {
          tags: ['Inventory'],
          summary: 'Update stock quantity for a vehicle',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string' } }],
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/StockUpdateBody' } } },
          },
          responses: {
            200: { description: 'Stock updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryItem' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            404: { description: 'Vehicle not found' },
          },
        },
      },
      '/v1/purchases': {
        post: {
          tags: ['Purchases'],
          summary: 'Purchase a vehicle',
          requestBody: {
            required: true,
            content: { 'application/json': { schema: { $ref: '#/components/schemas/PurchaseBody' } } },
          },
          responses: {
            201: { description: 'Purchase completed', content: { 'application/json': { schema: { $ref: '#/components/schemas/PurchaseRecord' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            404: { description: 'Vehicle not found' },
            409: { description: 'Vehicle not available for purchase' },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
