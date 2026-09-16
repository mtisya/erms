import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import { auditContext } from "./common/middleware/audit.middleware";
import routes from "./routes";


const app = express();
app.use(auditContext);


// Security middleware
app.use(
    helmet()
);


// CORS configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || "http://localhost:5173",
        credentials: true
    })
);


// Body parser
app.use(
    express.json({
        limit: "10mb"
    })
);

app.use(
    express.urlencoded({
        extended: true
    })
);


// Health check
app.get("/", (_req: Request, res: Response) => {

    res.json({

        success: true,

        message: "ERMS API Running",

        environment: process.env.NODE_ENV || "development"

    });

});


// API routes
app.use(
    "/api",
    routes
);


// 404 handler
app.use(
    (
        req: Request,
        res: Response
    ) => {

        res.status(404).json({

            success: false,

            message: `Route ${req.originalUrl} not found`

        });

    }
);


// Global error handler
app.use(
    (
        error: Error,
        _req: Request,
        res: Response,
        _next: NextFunction
    ) => {

        console.error(error);


        res.status(500).json({

            success: false,

            message: "Internal server error"

        });

    }
);


export default app;