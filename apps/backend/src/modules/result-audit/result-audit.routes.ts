import {
    Router
} from "express";

import {
    index,
    show,
    electionHistory
} from "./result-audit.controller";


const router =
    Router();


/**
 * GET ALL RESULT AUDIT RECORDS
 *
 * Optional:
 *
 * ?electionId=
 * ?resultId=
 * ?candidateId=
 * ?pollingStationId=
 * ?action=
 * ?page=
 * ?limit=
 */
router.get(
    "/",
    index
);


/**
 * GET AUDIT HISTORY FOR ONE RESULT
 */
router.get(
    "/result/:resultId",
    show
);


/**
 * GET ALL RESULT AUDIT HISTORY
 * FOR AN ELECTION
 */
router.get(
    "/election/:electionId",
    electionHistory
);


export default router;
