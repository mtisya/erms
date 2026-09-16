import { Request, Response, NextFunction } from "express";

export function auditContext(
    req: Request,
    res: Response,
    next: NextFunction
) {
    res.locals.audit = {
        // req.user is not part of Express' default Request type; cast to any to access it
        userId: (req as any).user?.userId ?? null,
        ip: req.ip,
        userAgent: req.get("user-agent") ?? "",
    };

    next();
}