import {
    Request,
    Response,
    NextFunction
} from "express";

import { ScopeLevel } from "@prisma/client";

import {
    requireScope,
    requirePermission
} from "../../services/authorization.service";


/*
|--------------------------------------------------------------------------
| Authenticated Request
|--------------------------------------------------------------------------
*/

interface AuthenticatedRequest extends Request {
    user?: {
        userId: string;
        email?: string;
        role?: string;
    };
}


/*
|--------------------------------------------------------------------------
| Require Geographical Scope
|--------------------------------------------------------------------------
|
| Checks whether the authenticated user is authorized to access
| the requested geographical area.
|
| Example:
|
| requireGeographicalScope(
|     ScopeLevel.POLLING_STATION,
|     req => req.body.pollingStationId
| )
|
|--------------------------------------------------------------------------
*/

export function requireGeographicalScope(
    level: ScopeLevel,
    getScopeId: (
        req: Request
    ) => string | undefined
) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {

            const request =
                req as AuthenticatedRequest;


            /*
            |--------------------------------------------------------------------------
            | Authentication Check
            |--------------------------------------------------------------------------
            */

            if (!request.user) {
                res.status(401).json({
                    success: false,
                    message: "Authentication required."
                });

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Get Scope ID
            |--------------------------------------------------------------------------
            */

            const scopeId =
                getScopeId(req);


            if (!scopeId) {
                res.status(400).json({
                    success: false,
                    message:
                        "Geographical scope could not be determined."
                });

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Check Geographical Scope
            |--------------------------------------------------------------------------
            */

            await requireScope(
                request.user.userId,
                level,
                scopeId
            );


            /*
            |--------------------------------------------------------------------------
            | Continue
            |--------------------------------------------------------------------------
            */

            next();

        } catch (error: unknown) {

            console.error(
                "Scope authorization error:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "You are not authorized for this geographical area.";

            res.status(403).json({
                success: false,
                message
            });
        }
    };
}


/*
|--------------------------------------------------------------------------
| Require Permission
|--------------------------------------------------------------------------
|
| Checks whether the authenticated user has the requested permission.
|
| Example:
|
| requirePermissionMiddleware(
|     "results.create"
| )
|
|--------------------------------------------------------------------------
*/

export function requirePermissionMiddleware(
    permissionName: string
) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {

        try {

            const request =
                req as AuthenticatedRequest;


            /*
            |--------------------------------------------------------------------------
            | Authentication Check
            |--------------------------------------------------------------------------
            */

            if (!request.user) {
                res.status(401).json({
                    success: false,
                    message:
                        "Authentication required."
                });

                return;
            }


            /*
            |--------------------------------------------------------------------------
            | Check Permission
            |--------------------------------------------------------------------------
            */

            await requirePermission(
                request.user.userId,
                permissionName
            );


            /*
            |--------------------------------------------------------------------------
            | Continue
            |--------------------------------------------------------------------------
            */

            next();

        } catch (error: unknown) {

            console.error(
                "Permission authorization error:",
                error
            );

            const message =
                error instanceof Error
                    ? error.message
                    : "You do not have permission to perform this action.";

            res.status(403).json({
                success: false,
                message
            });
        }
    };
}