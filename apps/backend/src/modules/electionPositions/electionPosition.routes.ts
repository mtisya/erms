import { Router } from "express";

import {
    createPosition
} from "./electionPosition.controller";


const router = Router();


router.post(
    "/",
    createPosition
);


export default router;