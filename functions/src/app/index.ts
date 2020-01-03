import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import responses from '_responses';
import routes from '../routes';

const app = express();

// Setup middlewares
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(routes);

// All unknown routes are unauthorized by default
app.use((_, res) => responses.unauthorized(res));

export default app;
