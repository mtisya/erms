import { Router } from "express";

import {
    liveResults
} from "./live-results.controller";


const router = Router();


router.get(
    "/:electionId",
    liveResults
);


export default router;

