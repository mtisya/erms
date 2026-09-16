import { Router } from "express";

import countyRoutes from "./county/county.routes";
import constituencyRoutes from "./constituency/constituency.routes";
import wardRoutes from "./ward/ward.routes";
import pollingRoutes from "./polling-station/polling.routes";


const router = Router();



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
    pollingRoutes
);



export default router;