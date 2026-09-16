import { Router } from "express";

import {
    pollingStation,
    ward,
    constituency,
    county,
    national
} from "./tally.controller";


const router = Router();


/**
 * Polling Station
 */
router.get(
    "/polling-station/:electionId/:pollingStationId",
    pollingStation
);


/**
 * Ward
 */
router.get(
    "/ward/:electionId/:wardId",
    ward
);


/**
 * Constituency
 */
router.get(
    "/constituency/:electionId/:constituencyId",
    constituency
);


/**
 * County
 */
router.get(
    "/county/:electionId/:countyId",
    county
);


/**
 * National
 */
router.get(
    "/national/:electionId",
    national
);


export default router;
