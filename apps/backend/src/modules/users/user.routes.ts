import { Router } from "express";

import {
    listUsers,
    createUser
} from "./user.controller";

import {
    authMiddleware
} from "../../common/middleware/auth.middleware";

import {
    requirePermission
} from "../../common/middleware/permission.middleware";

import {


    getUser,

    updateUser,

    deactivateUser

} from "./user.controller";




const router = Router();



router.get(

    "/",

    authMiddleware,

    requirePermission("USER_VIEW"),

    listUsers

);



router.post(

    "/",

    authMiddleware,

    requirePermission("USER_CREATE"),

    createUser

);
router.get(
    "/:id",
    authMiddleware,
    requirePermission("USER_VIEW"),
    getUser
);



router.put(
    "/:id",
    authMiddleware,
    requirePermission("USER_UPDATE"),
    updateUser
);



router.delete(
    "/:id",
    authMiddleware,
    requirePermission("USER_DELETE"),
    deactivateUser
);





export default router;