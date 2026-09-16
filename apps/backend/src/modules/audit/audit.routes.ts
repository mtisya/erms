import { Router } from "express";

import {
    listAuditLogs
} from "./audit.controller";


import {
    authMiddleware
} from "../../common/middleware/auth.middleware";


import {
    requirePermission
} from "../../common/middleware/permission.middleware";


const router = Router();



router.get(

    "/",

    authMiddleware,

    requirePermission("AUDIT_VIEW"),

    listAuditLogs

);



export default router;