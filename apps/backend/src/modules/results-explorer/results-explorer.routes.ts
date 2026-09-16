import { Router } from "express";

import {
    pollingStation,
    ward,
    constituency,
    county,
    national
} from "./results-explorer.controller";


const router = Router();


/**
 * NATIONAL
 */
router.get(
    "/national/:electionId",
    national
);


/**
 * COUNTY
 */
router.get(
    "/county/:electionId/:countyId",
    county
);


/**
 * CONSTITUENCY
 */
router.get(
    "/constituency/:electionId/:constituencyId",
    constituency
);


/**
 * WARD
 */
router.get(
    "/ward/:electionId/:wardId",
    ward
);


/**
 * POLLING STATION
 */
router.get(
    "/polling-station/:electionId/:pollingStationId",
    pollingStation
);


export default router;