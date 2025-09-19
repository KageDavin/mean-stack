import express, { Express, Request, Response } from 'express';

// Create an Express application
const app: Express = express();
const port = process.env.PORT || 3000;

// Define a basic route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express with TypeScript!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
