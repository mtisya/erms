import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    runWithRequestContext
} from "../context/request.context";


export function auditContext(
    req: Request,
    _res: Response,
    next: NextFunction
) {

    runWithRequestContext(
        {
            userId:
                (req as any).user?.userId ?? null,

            ipAddress:
                req.ip,

            userAgent:
                req.get("user-agent") ?? undefined
        },

        () => {
            next();
        }
    );

}