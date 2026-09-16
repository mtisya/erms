import { Router } from "express";

import {
    createConstituencyController
} from "./constituency.controller";


const router = Router();


router.post(
    "/",
    createConstituencyController
);


export default router;