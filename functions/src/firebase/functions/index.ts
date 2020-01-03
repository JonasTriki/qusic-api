import 'module-alias/register';
import * as functions from 'firebase-functions';
import app from '../../app';

// Firebase Functions endpoints
export const api = functions
  .region('europe-west2')
  .runWith({ memory: '2GB', timeoutSeconds: 120 })
  .https
  .onRequest(app);
