import { Router } from "express";

import {

listConstituencies,
getConstituency,
createConstituency

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



export default router;