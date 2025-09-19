import express from 'express';
import type { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

const port = process.env.PORT || 3000;
const app: Express = express();
app.use(express.json());

// Swagger options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Class Demos API',
            version: '1.0.0',
            description: 'Backend API for class demos',
        },
        servers: [
            { url: `http://localhost:${port}` },
        ],
    },
    apis: ['./src/index.ts'], // Path to the API docs
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// A basic GET route to test if the server is running
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to the Class Demos API!');
});

// A more specific route to serve data for your frontend demos
/**
 * @swagger
 * /api/demos:
 *   get:
 *     summary: Returns a list of class demos.
 *     responses:
 *       200:
 *         description: A list of demos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
app.get('/api/demos', (req: Request, res: Response) => {
  const demos = [
    { id: 1, name: 'Component Interaction' },
    { id: 2, name: 'Form Handling' },
    { id: 3, name: 'API Fetch' },
  ];
  res.status(200).json(demos);
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api-docs`);
});
