import {
    Request,
    Response,
    NextFunction
} from "express";

import {
    verifyAccessToken
} from "../../modules/auth/token.service";


export interface AuthRequest extends Request {
    user?: {
        userId: string;
        email: string;
        role: string;
    };
}


export function authMiddleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
) {

    try {

        const header =
            req.headers.authorization;


        if (!header) {

            return res.status(401).json({
                success: false,
                message: "Authorization token missing"
            });

        }


        const [scheme, token] =
            header.split(" ");


        if (
            scheme !== "Bearer" ||
            !token
        ) {

            return res.status(401).json({
                success: false,
                message:
                    "Invalid authorization format"
            });

        }


        const decoded =
            verifyAccessToken(token);


        req.user = decoded as {
            userId: string;
            email: string;
            role: string;
        };


        next();

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        return res.status(401).json({
            success: false,
            message:
                "Invalid or expired token"
        });

    }

}