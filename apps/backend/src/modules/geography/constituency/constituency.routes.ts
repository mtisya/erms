import { Router } from "express";

import {
    listConstituencies,
    getConstituency,
    createConstituency,
    updateConstituency,
    deleteConstituency,
} from "./constituency.controller";


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

    requirePermission("COUNTY_VIEW"),

    listConstituencies

);



router.get(

    "/:id",

    authMiddleware,

    requirePermission("COUNTY_VIEW"),

    getConstituency

);



router.post(

    "/",

    authMiddleware,

    requirePermission("COUNTY_CREATE"),

    createConstituency

);
router.put(
    "/:id",
    authMiddleware,
    requirePermission("COUNTY_CREATE"),
    updateConstituency,
);

router.delete(
    "/:id",
    authMiddleware,
    requirePermission("COUNTY_CREATE"),
    deleteConstituency,
);



export default router;