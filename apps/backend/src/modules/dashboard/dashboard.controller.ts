import { Request, Response } from "express";
import { getDashboardSummary, getLeaderboard, getReportingProgress } from "./dashboard.service";

export async function summary(
    req: Request,
    res: Response
) {

    try {

        const data = await getDashboardSummary();

        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}
export async function leaderboard(
    req: Request,
    res: Response
) {

    try {

        const electionId = Array.isArray(req.params.electionId) 
            ? req.params.electionId[0] 
            : req.params.electionId;

        const data = await getLeaderboard(electionId);

        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}

export async function progress(
    req: Request,
    res: Response
) {

    try {

        const electionId = Array.isArray(req.params.electionId)
            ? req.params.electionId[0]
            : req.params.electionId;

        const data = await getReportingProgress(electionId);

        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        return res.status(500).json({

            success: false,

            message: error.message

        });

    }

}



