import { Router } from "express";

import {
    authMiddleware
} from "../common/middleware/auth.middleware";

import {
    requirePermission
} from "../common/middleware/permission.middleware";


const router = Router();



router.get(
    "/users",
    authMiddleware,
    requirePermission("USER_CREATE"),
    (req,res)=>{


        res.json({

            success:true,

            message:"You can manage users"

        });


    }
);



export default router;