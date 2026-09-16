import { Router } from "express";

import {
    authMiddleware
} from "../common/middleware/auth.middleware";


const router = Router();


router.get(
    "/protected",
    authMiddleware,
    (req:any,res)=>{


        res.json({

            success:true,

            message:"Protected route accessed",

            user:req.user

        });


    }
);


export default router;