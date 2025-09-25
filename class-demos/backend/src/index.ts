// backend/src/index.ts
import express from 'express';
import type { Express, Request, Response } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { connectDB  } from '@config/db.config.ts';)
import Demo from './models/demo.model';
const port = process.env.PORT || 3000;
const app: Express = express();
app.use(express.json());

// Connect to the database and then start the server
// connectDB().then(() => {
//     app.listen(port, () => {
//         console.log(`Server is running at http://localhost:${port}`);
//     });
// });

// Swagger setup (your existing code)
const swaggerOptions = {
    definition: { 
        openapi: '3.0.0',
        info: {
            title: 'Class Demos API',
            version: '1.0.0',
            description: 'Backend API for class demos',
        },
        servers: [
            { url: `http://127.0.0.1:${port}` },
        ],
    },
    apis: ['./src/index.ts'],
};
const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// --- Define your API Routes ---
// GET route to fetch demos from the database
/**
 * @swagger
 * /api/demos:
 *   get:
 *     summary: Returns a list of class demos from the database.
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
app.get('/api/demos', async (req: Request, res: Response) => {
  try {
    const demos = await Demo.find(); // Fetch data from MongoDB
    res.status(200).json(demos);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching demos' });
  }
});

// POST route to add a new demo
/**
 * @swagger
 * /api/demos:
 *   post:
 *     summary: Creates a new demo entry.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Demo created successfully.
 *       500:
 *         description: Error creating demo.
 */
app.post('/api/demos', async (req: Request, res: Response) => {
  try {
    const newDemo = new Demo(req.body);
    await newDemo.save();
    res.status(201).json(newDemo);
  } catch (err) {
    res.status(500).json({ message: 'Error creating demo' });
  }
});