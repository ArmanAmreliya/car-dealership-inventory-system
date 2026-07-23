import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'DealerFlow API',
      version: '1.0.0',
      description:
        'Car Dealership Inventory Management System REST API. ' +
        'All protected endpoints require a Bearer JWT token obtained from POST /api/v1/auth/login. ' +
        'Admin-only endpoints additionally require the authenticated user to have role="admin".',
    },
    servers: [{ url: '/api', description: 'Current host' }],
    tags: [
      { name: 'Auth',      description: 'Registration and login' },
      { name: 'Vehicles',  description: 'Vehicle CRUD, search, purchase, and restock' },
      { name: 'Inventory', description: 'Inventory status and stock management' },
      { name: 'Purchases', description: 'Purchase history' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        // ── Error ────────────────────────────────────────────────────────────
        ErrorResponse: {
          type: 'object',
          properties: {
            status:  { type: 'string', example: 'error' },
            message: { type: 'string', example: 'Forbidden' },
          },
        },

        // ── Auth ─────────────────────────────────────────────────────────────
        RegisterBody: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name:     { type: 'string',  example: 'Jane Doe' },
            email:    { type: 'string',  format: 'email', example: 'jane@example.com' },
            password: { type: 'string',  minLength: 8, example: 'password123' },
          },
        },
        LoginBody: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email:    { type: 'string', format: 'email', example: 'jane@example.com' },
            password: { type: 'string', example: 'password123' },
          },
        },
        AuthResponse: {
          type: 'object',
          properties: {
            token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' },
            user: {
              type: 'object',
              properties: {
                id:        { type: 'string', format: 'uuid' },
                email:     { type: 'string', format: 'email' },
                name:      { type: 'string', nullable: true },
                role:      { type: 'string', enum: ['user', 'admin'], example: 'user' },
                createdAt: { type: 'string', format: 'date-time' },
                updatedAt: { type: 'string', format: 'date-time' },
              },
            },
          },
        },

        // ── Vehicle ───────────────────────────────────────────────────────────
        Vehicle: {
          type: 'object',
          properties: {
            id:            { type: 'string', format: 'uuid' },
            make:          { type: 'string', example: 'Toyota' },
            model:         { type: 'string', example: 'Camry' },
            year:          { type: 'integer', example: 2024 },
            price:         { type: 'number',  example: 28000 },
            vin:           { type: 'string',  example: '1HGBH41JXMN109186' },
            mileage:       { type: 'integer', example: 15000, nullable: true },
            color:         { type: 'string',  example: 'White', nullable: true },
            category:      { type: 'string',  example: 'Sedan', nullable: true },
            imageUrl:      { type: 'string',  format: 'uri', nullable: true },
            isAvailable:   { type: 'boolean', example: true },
            stockQuantity: { type: 'integer', example: 3 },
            createdAt:     { type: 'string',  format: 'date-time' },
            updatedAt:     { type: 'string',  format: 'date-time' },
          },
        },
        CreateVehicleBody: {
          type: 'object',
          required: ['make', 'model', 'year', 'price', 'vin'],
          properties: {
            make:     { type: 'string',  example: 'Toyota' },
            model:    { type: 'string',  example: 'Camry' },
            year:     { type: 'integer', example: 2024 },
            price:    { type: 'number',  example: 28000 },
            vin:      { type: 'string',  example: '1HGBH41JXMN109186' },
            mileage:  { type: 'integer', example: 0 },
            color:    { type: 'string',  example: 'White' },
            category: { type: 'string',  example: 'Sedan' },
            imageUrl: { type: 'string',  format: 'uri', example: 'https://example.com/car.jpg' },
          },
        },
        UpdateVehicleBody: {
          type: 'object',
          description: 'At least one field must be provided.',
          properties: {
            make:        { type: 'string' },
            model:       { type: 'string' },
            year:        { type: 'integer' },
            price:       { type: 'number' },
            mileage:     { type: 'integer' },
            color:       { type: 'string' },
            category:    { type: 'string' },
            imageUrl:    { type: 'string', format: 'uri' },
            isAvailable: { type: 'boolean' },
          },
        },

        // ── Inventory ─────────────────────────────────────────────────────────
        InventoryStatus: {
          type: 'object',
          properties: {
            totalVehicles:       { type: 'integer' },
            availableVehicles:   { type: 'integer' },
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
            id:            { type: 'string', format: 'uuid' },
            vehicleId:     { type: 'string', format: 'uuid' },
            make:          { type: 'string' },
            model:         { type: 'string' },
            year:          { type: 'integer' },
            vin:           { type: 'string' },
            price:         { type: 'number' },
            stockQuantity: { type: 'integer' },
            isAvailable:   { type: 'boolean' },
            createdAt:     { type: 'string', format: 'date-time' },
            updatedAt:     { type: 'string', format: 'date-time' },
          },
        },
        StockUpdateBody: {
          type: 'object',
          required: ['stockQuantity'],
          properties: {
            stockQuantity: { type: 'integer', minimum: 0, example: 5 },
          },
        },
        RestockBody: {
          type: 'object',
          required: ['quantity'],
          description: 'Amount to ADD to current stock (not an absolute value).',
          properties: {
            quantity: { type: 'integer', minimum: 0, example: 5 },
          },
        },

        // ── Purchase ──────────────────────────────────────────────────────────
        PurchaseRecord: {
          type: 'object',
          properties: {
            purchaseId:  { type: 'string', format: 'uuid' },
            vehicleId:   { type: 'string', format: 'uuid' },
            make:        { type: 'string' },
            model:       { type: 'string' },
            year:        { type: 'integer' },
            vin:         { type: 'string' },
            price:       { type: 'number' },
            purchasedAt: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {

      // ════════════════════════════════════════════════════════════════════════
      // AUTH
      // ════════════════════════════════════════════════════════════════════════

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
            201: { description: 'User registered',        content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error',       content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            409: { description: 'Email already in use',   content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
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
            200: { description: 'JWT token + user object', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Missing credentials' },
            401: { description: 'Invalid credentials' },
          },
        },
      },

      // Compatibility aliases (no /v1 prefix)
      '/auth/register': {
        post: {
          tags: ['Auth'],
          summary: 'Register (alias — same as /v1/auth/register)',
          security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RegisterBody' } } } },
          responses: {
            201: { description: 'User registered',  content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            400: { description: 'Validation error' },
            409: { description: 'Email already in use' },
          },
        },
      },
      '/auth/login': {
        post: {
          tags: ['Auth'],
          summary: 'Login (alias — same as /v1/auth/login)',
          security: [],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/LoginBody' } } } },
          responses: {
            200: { description: 'JWT token + user object', content: { 'application/json': { schema: { $ref: '#/components/schemas/AuthResponse' } } } },
            401: { description: 'Invalid credentials' },
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════════
      // VEHICLES
      // ════════════════════════════════════════════════════════════════════════

      '/v1/vehicles': {
        get: {
          tags: ['Vehicles'],
          summary: 'List all vehicles',
          parameters: [
            { in: 'query', name: 'make',         schema: { type: 'string' },  description: 'Filter by make (case-insensitive)' },
            { in: 'query', name: 'model',        schema: { type: 'string' },  description: 'Filter by model' },
            { in: 'query', name: 'year',         schema: { type: 'integer' }, description: 'Filter by exact year' },
            { in: 'query', name: 'availability', schema: { type: 'boolean' }, description: 'true = available only' },
            { in: 'query', name: 'minPrice',     schema: { type: 'number' },  description: 'Minimum price (inclusive)' },
            { in: 'query', name: 'maxPrice',     schema: { type: 'number' },  description: 'Maximum price (inclusive)' },
          ],
          responses: {
            200: { description: 'Array of vehicles', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Vehicle' } } } } },
            401: { description: 'Unauthorized' },
          },
        },
        post: {
          tags: ['Vehicles'],
          summary: 'Create a new vehicle',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CreateVehicleBody' } } } },
          responses: {
            201: { description: 'Vehicle created', content: { 'application/json': { schema: { $ref: '#/components/schemas/Vehicle' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/v1/vehicles/search': {
        get: {
          tags: ['Vehicles'],
          summary: 'Search vehicles by make, model, year, category, or price range',
          parameters: [
            { in: 'query', name: 'make',         schema: { type: 'string' } },
            { in: 'query', name: 'model',        schema: { type: 'string' } },
            { in: 'query', name: 'year',         schema: { type: 'integer' } },
            { in: 'query', name: 'availability', schema: { type: 'boolean' } },
            { in: 'query', name: 'minPrice',     schema: { type: 'number' } },
            { in: 'query', name: 'maxPrice',     schema: { type: 'number' } },
          ],
          responses: {
            200: { description: 'Matching vehicles', content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/Vehicle' } } } } },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/v1/vehicles/{id}': {
        get: {
          tags: ['Vehicles'],
          summary: 'Get a single vehicle by ID',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            200: { description: 'Vehicle found', content: { 'application/json': { schema: { $ref: '#/components/schemas/Vehicle' } } } },
            401: { description: 'Unauthorized' },
            404: { description: 'Not found' },
          },
        },
        put: {
          tags: ['Vehicles'],
          summary: 'Update a vehicle',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/UpdateVehicleBody' } } } },
          responses: {
            200: { description: 'Vehicle updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/Vehicle' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            404: { description: 'Not found' },
          },
        },
        delete: {
          tags: ['Vehicles'],
          summary: 'Delete a vehicle — Admin only',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            204: { description: 'Deleted successfully' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — admin role required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Not found' },
          },
        },
      },
      '/v1/vehicles/{id}/purchase': {
        post: {
          tags: ['Vehicles'],
          summary: 'Purchase a vehicle — decreases stock by 1',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          responses: {
            201: { description: 'Purchase completed', content: { 'application/json': { schema: { $ref: '#/components/schemas/PurchaseRecord' } } } },
            401: { description: 'Unauthorized' },
            404: { description: 'Vehicle not found' },
            409: { description: 'Vehicle not available for purchase (out of stock)', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
      '/v1/vehicles/{id}/restock': {
        post: {
          tags: ['Vehicles'],
          summary: 'Restock a vehicle — adds quantity to current stock (Admin only)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RestockBody' } } } },
          responses: {
            200: { description: 'Stock updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryItem' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — admin role required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Vehicle not found' },
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════════
      // INVENTORY
      // ════════════════════════════════════════════════════════════════════════

      '/v1/inventory': {
        get: {
          tags: ['Inventory'],
          summary: 'Get full inventory status with aggregate totals',
          responses: {
            200: { description: 'Inventory status', content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryStatus' } } } },
            401: { description: 'Unauthorized' },
          },
        },
      },
      '/v1/inventory/{id}': {
        patch: {
          tags: ['Inventory'],
          summary: 'Set absolute stock quantity for a vehicle — Admin only',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/StockUpdateBody' } } } },
          responses: {
            200: { description: 'Stock updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryItem' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — admin role required' },
            404: { description: 'Vehicle not found' },
          },
        },
      },
      '/v1/inventory/{id}/restock': {
        post: {
          tags: ['Inventory'],
          summary: 'Restock a vehicle via inventory route — adds quantity to current stock (Admin only)',
          parameters: [{ in: 'path', name: 'id', required: true, schema: { type: 'string', format: 'uuid' } }],
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/RestockBody' } } } },
          responses: {
            200: { description: 'Stock updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryItem' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            403: { description: 'Forbidden — admin role required', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
            404: { description: 'Vehicle not found' },
          },
        },
      },

      // ════════════════════════════════════════════════════════════════════════
      // PURCHASES
      // ════════════════════════════════════════════════════════════════════════

      '/v1/purchases': {
        post: {
          tags: ['Purchases'],
          summary: 'Purchase a vehicle via purchase route (body-based vehicleId)',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  required: ['vehicleId'],
                  properties: {
                    vehicleId: { type: 'string', format: 'uuid', example: 'a3f1c2d4-5e6b-7890-abcd-ef1234567890' },
                  },
                },
              },
            },
          },
          responses: {
            201: { description: 'Purchase completed', content: { 'application/json': { schema: { $ref: '#/components/schemas/PurchaseRecord' } } } },
            400: { description: 'Validation error' },
            401: { description: 'Unauthorized' },
            404: { description: 'Vehicle not found' },
            409: { description: 'Vehicle not available', content: { 'application/json': { schema: { $ref: '#/components/schemas/ErrorResponse' } } } },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJsdoc(options);
