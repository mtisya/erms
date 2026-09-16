import { Router } from "express";

import {
    positionResults
} from "./results-position.controller";


const router = Router();


router.get(
    "/:electionId/:positionId",
    positionResults
);


export default router;