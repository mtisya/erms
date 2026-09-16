import { Router, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";

import {
    create,
    index,
    show,
    update,
    remove
} from "./result.controller";

import {
    createResultValidation,
    updateResultValidation
} from "./result.validation";

import {
    authMiddleware
} from "../../common/middleware/auth.middleware";

import {
    auditContext
} from "../../common/middleware/audit.middleware";

import {
    ScopeLevel
} from "@prisma/client";

import {
    requirePermissionMiddleware,
    requireGeographicalScope
} from "../../common/middleware/scope.middleware";


const router = Router();


/*
|--------------------------------------------------------------------------
| VALIDATION MIDDLEWARE
|--------------------------------------------------------------------------
*/

const validate = (
    req: Request,
    res: Response,
    next: NextFunction
) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {

        return res.status(422).json({
            success: false,
            errors: errors.array()
        });

    }

    next();
};


/*
|--------------------------------------------------------------------------
| CREATE RESULT
|--------------------------------------------------------------------------
|
| Authentication
|      ↓
| Audit Context
|      ↓
| Permission
|      ↓
| Validate Input
|      ↓
| Geographic Scope
|      ↓
| Controller
|
|--------------------------------------------------------------------------
*/

router.post(
    "/",

    authMiddleware,

    auditContext,

    requirePermissionMiddleware(
        "results.create"
    ),

    createResultValidation,

    validate,

    requireGeographicalScope(
        ScopeLevel.POLLING_STATION,
        (req) => req.body.pollingStationId
    ),

    create
);


/*
|--------------------------------------------------------------------------
| GET ALL RESULTS
|--------------------------------------------------------------------------
*/

router.get(
    "/",

    authMiddleware,

    auditContext,

    requirePermissionMiddleware(
        "results.view"
    ),

    index
);


/*
|--------------------------------------------------------------------------
| GET SINGLE RESULT
|--------------------------------------------------------------------------
*/

router.get(
    "/:id",

    authMiddleware,

    auditContext,

    requirePermissionMiddleware(
        "results.view"
    ),

    show
);


/*
|--------------------------------------------------------------------------
| UPDATE RESULT
|--------------------------------------------------------------------------
*/

router.put(
    "/:id",

    authMiddleware,

    auditContext,

    requirePermissionMiddleware(
        "results.update"
    ),

    updateResultValidation,

    validate,

    update
);


/*
|--------------------------------------------------------------------------
| DELETE RESULT
|--------------------------------------------------------------------------
*/

router.delete(
    "/:id",

    authMiddleware,

    auditContext,

    requirePermissionMiddleware(
        "results.delete"
    ),

    remove
);


export default router;