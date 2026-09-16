import { Router } from "express";

import {
    pending,
    show,
    verify,
    approve,
    reject
} from "./result-verification.controller";


const router = Router();


router.get(
    "/pending/:electionId",
    pending
);


router.get(
    "/:id",
    show
);


router.patch(
    "/:id/verify",
    verify
);


router.patch(
    "/:id/approve",
    approve
);


router.patch(
    "/:id/reject",
    reject
);


export default router;

