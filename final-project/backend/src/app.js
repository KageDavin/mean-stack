import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import apiRouter from './routes/api/index.js';
import errorHandler from './middleware/error.middleware.js';

const app = express();

app.use(helmet());
app.use(express.json());

// CORS
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:4200';
app.use(cors({ origin: CORS_ORIGIN }));

// logging
app.use(morgan('dev'));

// global rate limit - light
app.use(rateLimit({ windowMs: 60 * 1000, max: 200 }));

// mount api
app.use('/api/v1', apiRouter);

// error handler
app.use(errorHandler);

export default app;
