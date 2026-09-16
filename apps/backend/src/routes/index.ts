import { Router } from "express";

import authRoutes from "../modules/auth/auth.routes";
import testRoutes from "./test.routes";
import adminRoutes from "./admin.routes";
import userRoutes from "../modules/users/user.routes";
import geographyRoutes from "../modules/geography/geography.routes";
import auditRoutes from "../modules/audit/audit.routes";
import electionRoutes from "../modules/elections/election.routes";
import electionPositionRoutes from "../modules/electionPositions/electionPosition.routes";
import candidateRoutes from "../modules/candidates/candidate.routes";
import countyRoutes from "../modules/counties/county.routes";
import constituencyRoutes from "../modules/constituencies/constituency.routes";
import wardRoutes from "../modules/wards/ward.routes";
import pollingStationRoutes from "../modules/polling-stations/polling-station.routes";
import resultRoutes from "../modules/results/result.routes";
import tallyRoutes from "../modules/tally/tally.routes";
import dashboardRoutes from "../modules/dashboard/dashboard.routes";
import liveResultsRoutes from "../modules/live-results/live-results.routes";
import resultVerificationRoutes from "../modules/result-verification/result-verification.routes";
import resultAuditRoutes from "../modules/result-audit/result-audit.routes";
import auditHistoryRoutes from "../modules/audit-history/audit-history.routes";
import resultsExplorerRoutes from "../modules/results-explorer/results-explorer.routes";
import resultsPositionRoutes from "../modules/results/results-position.routes";



const router = Router();


router.use(
    "/auth",
    authRoutes
);


router.use(
    "/test",
    testRoutes
);


router.use(
    "/admin",
    adminRoutes
);

router.use(
    "/users",
    userRoutes
);
router.use(
    "/geography",
    geographyRoutes
);
router.use(
    "/audit",
    auditRoutes
);
router.use(
    "/elections",
    electionRoutes
);
router.use(
    "/election-positions",
    electionPositionRoutes
);

router.use(
    "/candidates",
    candidateRoutes
);

router.use(
    "/counties",
    countyRoutes
);

router.use(
    "/constituencies",
    constituencyRoutes
);

router.use(
    "/wards",
    wardRoutes
);
router.use(
    "/polling-stations",
    pollingStationRoutes
);

router.use(
    "/results/position",
    resultsPositionRoutes
);

router.use(
    "/results",
    resultRoutes
);

router.use(
    "/tally",
    tallyRoutes
);

router.use(
    "/dashboard",
    dashboardRoutes
);

router.use(
    "/live-results",
    liveResultsRoutes
);

router.use(
    "/result-verification",
    resultVerificationRoutes
);

router.use(
    "/result-audit",
    resultAuditRoutes
);

router.use(
    "/audit-history",
    auditHistoryRoutes
);

router.use(
    "/results-explorer",
    resultsExplorerRoutes
);
export default router;