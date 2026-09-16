import { Router } from "express";

import {
    createCountyController
} from "./county.controller";


const router = Router();


router.post(
    "/",
    createCountyController
);


export default router;