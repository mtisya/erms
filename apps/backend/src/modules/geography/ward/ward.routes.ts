import { Router } from "express";

import {
    listWards,
    getWard,
    createWard,
    updateWard,
    deleteWard,
} from "./ward.controller";


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

requirePermission("WARD_VIEW"),

listWards

);



router.get(

"/:id",

authMiddleware,

requirePermission("WARD_VIEW"),

getWard

);



router.post(

"/",

authMiddleware,

requirePermission("COUNTY_CREATE"),

createWard

);
router.put(
    "/:id",
    authMiddleware,
    requirePermission("COUNTY_CREATE"),
    updateWard,
);

router.delete(
    "/:id",
    authMiddleware,
    requirePermission("COUNTY_CREATE"),
    deleteWard,
);



export default router;