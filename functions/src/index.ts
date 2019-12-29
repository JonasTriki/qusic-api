import 'module-alias/register';
import * as functions from 'firebase-functions';
import server from './server';

export const api = functions
    .region("europe-west2")
    .runWith({memory: "2GB", timeoutSeconds: 120})
    .https
    .onRequest(server);