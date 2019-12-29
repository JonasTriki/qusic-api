import {Router} from "express";
import groups from "./groups";

const router = Router();

router.use("/groups", groups);

export default router;