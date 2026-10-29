
import { Router } from "express";
import * as electionController from "./election.controller";
import {
    createElectionValidation,
    updateElectionValidation,
} from "./election.validation";
import { authMiddleware } from "../../common/middleware/auth.middleware";
import { requirePermission } from "../../common/middleware/permission.middleware";

const router = Router();

// Read endpoints remain public for compatibility with existing election pages.
router.get("/", electionController.getElections);
router.get("/:id", electionController.getElectionById);

// Administrative changes require authentication and the relevant permission.
router.post(
    "/",
    authMiddleware,
    requirePermission("ELECTION_CREATE"),
    createElectionValidation,
    electionController.createElection
);

router.put(
    "/:id",
    authMiddleware,
    requirePermission("ELECTION_UPDATE"),
    updateElectionValidation,
    electionController.updateElection
);

router.delete(
    "/:id",
    authMiddleware,
    requirePermission("ELECTION_DELETE"),
    electionController.deleteElection
);

export default router;
