import { Router } from "express";

import {
    summary,
    leaderboard,
    progress
} from "./dashboard.controller";


const router = Router();


router.get(
    "/summary",
    summary
);


router.get(
    "/leaderboard/:electionId",
    leaderboard
);


router.get(
    "/progress/:electionId",
    progress
);


export default router;

