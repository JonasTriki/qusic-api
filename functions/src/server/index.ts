import 'module-alias/register';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import admin from 'firebase-admin';

import responses from '_responses';
import logger from '_logger';

import serviceAccount from '../firebase/admin/serviceAccount.json';
import routes from './routes';

// Initialize firebase admin
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: serviceAccount.project_id,
    clientEmail: serviceAccount.client_email,
    privateKey: serviceAccount.private_key,
  }),
  databaseURL: 'https://qusic-app.firebaseio.com',
});

const app = express();
const port = process.env.PORT || 8080;

// Setup middlewares
app.use(cors({ credentials: true, origin: 'http://localhost:8080' }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Routes
app.use(routes);

// All unknown routes are unauthorized by default
app.use((_, res) => responses.unauthorized(res));

app.listen(port, () => {
  logger.info(`Server started at http://localhost:${port}`);
});

export default app;
