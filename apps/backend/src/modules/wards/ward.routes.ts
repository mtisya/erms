import { Router } from "express";

import {
    createWardController
} from "./ward.controller";


const router = Router();


router.post(
    "/",
    createWardController
);


export default router;