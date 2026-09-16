import {
    Request,
    Response
} from "express";

import {
    getResultAuditHistory,
    getResultHistory,
    getElectionResultHistory
} from "./result-audit.service";


/**
 * GET RESULT AUDIT HISTORY
 *
 * GET /api/result-audit
 */
export async function index(
    req: Request,
    res: Response
) {

    try {

        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 50;


        const data =
            await getResultAuditHistory({

                electionId:
                    typeof req.query.electionId === "string"
                        ? req.query.electionId
                        : undefined,

                resultId:
                    typeof req.query.resultId === "string"
                        ? req.query.resultId
                        : undefined,

                candidateId:
                    typeof req.query.candidateId === "string"
                        ? req.query.candidateId
                        : undefined,

                pollingStationId:
                    typeof req.query.pollingStationId === "string"
                        ? req.query.pollingStationId
                        : undefined,

                action:
                    typeof req.query.action === "string"
                        ? req.query.action
                        : undefined,

                page,

                limit

            });


        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        console.error(
            "Result audit error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch result audit history"

        });

    }

}


/**
 * GET HISTORY FOR ONE RESULT
 *
 * GET /api/result-audit/result/:resultId
 */
export async function show(
    req: Request,
    res: Response
) {

    try {

        const {
            resultId
        } = req.params;


        if (!resultId || Array.isArray(resultId)) {

            return res.status(400).json({

                success: false,

                message:
                    "Result ID is required"

            });

        }


        const data =
            await getResultHistory(
                resultId as string
            );


        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        return res.status(404).json({

            success: false,

            message:
                error.message ||
                "Result not found"

        });

    }

}


/**
 * GET ALL RESULT HISTORY FOR ELECTION
 *
 * GET /api/result-audit/election/:electionId
 */
export async function electionHistory(
    req: Request,
    res: Response
) {

    try {

        const {
            electionId
        } = req.params;


        if (!electionId || Array.isArray(electionId)) {

            return res.status(400).json({

                success: false,

                message:
                    "Election ID is required"

            });

        }


        const data =
            await getElectionResultHistory(
                electionId
            );


        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        console.error(
            "Election audit error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch election audit history"

        });

    }

}
