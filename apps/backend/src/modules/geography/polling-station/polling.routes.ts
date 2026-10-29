import { Router } from "express";

import {
    listPollingStations,
    createPollingStation,
    updatePollingStation,
    deletePollingStation,
} from "./polling.controller";

import {
authMiddleware
} from "../../../common/middleware/auth.middleware";


import {
requirePermission
} from "../../../common/middleware/permission.middleware";


const router = Router();



router.get(

"/",

authMiddleware,

requirePermission("POLLING_STATION_VIEW"),

listPollingStations

);



router.post(

"/",

authMiddleware,

requirePermission("COUNTY_CREATE"),

createPollingStation

);
router.put(
    "/:id",
    authMiddleware,
    requirePermission("COUNTY_CREATE"),
    updatePollingStation,
);

router.delete(
    "/:id",
    authMiddleware,
    requirePermission("COUNTY_CREATE"),
    deletePollingStation,
);


export default router;