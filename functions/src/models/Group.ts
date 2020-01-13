import { firestore } from 'firebase-admin';

export interface Group {
  name: string;
  hostUserId: string;
  devices: string[];
  password: string;
  coordinates: firestore.GeoPoint;
}
