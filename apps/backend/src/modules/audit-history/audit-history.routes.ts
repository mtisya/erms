import { Router } from "express";

import {
    index,
    resultHistory,
    verificationHistory
} from "./audit-history.controller";


const router = Router();


/**
 * ALL AUDIT LOGS
 *
 * GET /api/audit-history
 */
router.get(
    "/",
    index
);


/**
 * RESULT AUDIT HISTORY
 *
 * GET /api/audit-history/result/:resultId
 */
router.get(
    "/result/:resultId",
    resultHistory
);


/**
 * RESULT VERIFICATION HISTORY
 *
 * GET /api/audit-history/result/:resultId/verification
 */
router.get(
    "/result/:resultId/verification",
    verificationHistory
);


export default router;