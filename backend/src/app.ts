import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import healthRouter from './routes/health';
import crawlRouter from './routes/crawl';
import chatRouter from './routes/chat';
import { requestLogger } from './middleware/requestLogger';
import { notFoundHandler } from './middleware/notFoundHandler';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(requestLogger);

// Routes
app.use('/health', healthRouter);
app.use('/api/crawl', crawlRouter);
app.use('/api/chat', chatRouter);

// Catch 404 and forward to error handler
app.use(notFoundHandler);

// Global Error Handler
app.use(errorHandler);

export default app;
