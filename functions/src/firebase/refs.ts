import { firestore, geoFirestore } from './admin';

const db = firestore();
const geoDb = geoFirestore();

export const groups = geoDb.collection('groups');
export const users = db.collection('users');
