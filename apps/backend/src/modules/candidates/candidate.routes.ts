import { Router } from "express";

import {
    createCandidate,
    getCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate
} from "./candidate.controller";


const router = Router();


// ==================================================
// CREATE
// POST /api/candidates
// ==================================================

router.post(
    "/",
    createCandidate
);


// ==================================================
// LIST
// GET /api/candidates?electionId=...
// ==================================================

router.get(
    "/",
    getCandidates
);


// ==================================================
// SINGLE
// GET /api/candidates/:id
// ==================================================

router.get(
    "/:id",
    getCandidateById
);


// ==================================================
// UPDATE
// PUT /api/candidates/:id
// ==================================================

router.put(
    "/:id",
    updateCandidate
);


// ==================================================
// DELETE
// DELETE /api/candidates/:id
// ==================================================

router.delete(
    "/:id",
    deleteCandidate
);


export default router;