import { Router } from "express";

import {

    listCounties,
    getCounty,
    createCounty,
    updateCounty,
    deleteCounty

} from "./county.controller";


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

    listCounties

);



router.get(

    "/:id",

    authMiddleware,

    requirePermission("COUNTY_VIEW"),

    getCounty

);



router.post(

    "/",

    authMiddleware,

    requirePermission("COUNTY_CREATE"),

    createCounty

);



router.put(

    "/:id",

    authMiddleware,

    requirePermission("COUNTY_UPDATE"),

    updateCounty

);



router.delete(

    "/:id",

    authMiddleware,

    requirePermission("COUNTY_DELETE"),

    deleteCounty

);



export default router;