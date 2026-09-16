import { Router } from "express";

import * as electionController from "./election.controller";

import {

    createElectionValidation,

    updateElectionValidation

} from "./election.validation";

const router = Router();

router.get(
    "/",
    electionController.getElections
);

router.get(
    "/:id",
    electionController.getElectionById
);

router.post(
    "/",
    createElectionValidation,
    electionController.createElection
);

router.put(
    "/:id",
    updateElectionValidation,
    electionController.updateElection
);

router.delete(
    "/:id",
    electionController.deleteElection
);

export default router;