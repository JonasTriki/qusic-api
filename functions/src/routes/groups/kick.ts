import { Router } from 'express';
import { body } from 'express-validator';

import { TypedRequest, Group } from '_models';
import { refs, geoFirestore } from '_firebase';
import { GeoTransaction } from 'geofirestore';
import { validateInput } from '_middlewares';
import responses from '_responses';

interface Params {
  groupId: string;
  userId: string;
}

const router = Router();

const validationChain = [
  body('groupId').isString().isLength({ min: 1 }),
  body('userId').isString().isLength({ min: 1 }),
];

router.post('/', validationChain, validateInput);

router.post('/', async (req: TypedRequest<Params>, res) => {
  const { groupId, userId } = req.body;
  const { uid } = req.jwt;
  try {
    const groupRef = refs.groups.doc(groupId);
    await geoFirestore().runTransaction(async (transaction) => {
      const geotransaction = new GeoTransaction(transaction);
      return geotransaction.get(groupRef).then(async (groupDoc) => {
        if (!groupDoc.exists) {
          responses.badRequest(req, res);
          return;
        }
        const group = groupDoc.data() as Group;
        if (uid === userId || group.hostUserId !== uid) {
          responses.badRequest(req, res);
          return;
        }

        // Kick device from group
        const newDevices = group.devices.filter((deviceId) => deviceId !== userId);
        await geotransaction.update(groupRef, { devices: newDevices });

        responses.ok('Device kicked from group', res);
      });
    });
  } catch (err) {
    responses.unexpectedError(err, res);
  }
});

export default router;
