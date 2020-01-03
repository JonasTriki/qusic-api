import * as admin from 'firebase-admin';
import { GeoFirestore } from 'geofirestore';
import serviceAccount from './service-account.json';

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
    databaseURL: 'https://qusic-app.firebaseio.com',
  });
}

export const geoFirestore = (): GeoFirestore => {
  const db = admin.firestore();
  return new GeoFirestore(db);
};

export const { firestore } = admin;

export default admin;
