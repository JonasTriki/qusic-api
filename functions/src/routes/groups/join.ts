import { Router } from 'express';
import { body } from 'express-validator';
import * as argon2 from 'argon2';

import { TypedRequest, Group } from '_models';
import { refs, geoFirestore } from '_firebase';
import { GeoTransaction } from 'geofirestore';
import { validateInput } from '_middlewares';
import responses from '_responses';

interface Params {
  groupId: string;
  password?: string;
}

const router = Router();

const validationChain = [
  body('groupId').isString().isLength({ min: 1 }),
  body('password').optional(),
];

router.post('/', validationChain, validateInput);

router.post('/', async (req: TypedRequest<Params>, res) => {
  const { groupId, password } = req.body;
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

        // Verify group password
        let allowedToJoinGroup = true;
        if (group.password) {
          if (!password) {
            responses.badRequest(req, res);
            return;
          }
          allowedToJoinGroup = await argon2.verify(group.password, password);
        }
        if (allowedToJoinGroup) {
          // Password ok, join group
          const newDevices = [...group.devices, uid];
          await geotransaction.update(groupRef, { devices: newDevices });

          responses.ok('Group joined', res);
        } else {
          responses.badRequest(req, res);
        }
      });
    });
  } catch (err) {
    responses.unexpectedError(err, res);
  }
});

export default router;
