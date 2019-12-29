import { NextFunction, Request, Response, Router } from "express";
import { body, validationResult } from "express-validator";
import responses from "_responses";

const router = Router();

const inputValidator = [
  body("name").isString().isLength({ min: 1 }),
  body("pin").isNumeric().optional(),
];

router.post("/",
  inputValidator,
  (req: Request, res: Response, next: NextFunction): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return responses.badRequest(req, res);
    }
    next();
  }
);

router.post("/", async (req, res) => {
  try {
    const { name, pin } = req.body;

    // TODO: Implement
    responses.ok({groupName: name, groupPIN: pin}, res);
  } catch (err) {
    responses.unexpectedError(err, res);
  }
});

export default router;