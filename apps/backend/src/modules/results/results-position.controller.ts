import {
    Request,
    Response
} from "express";

import {
    getResultsByPosition
} from "./results-position.service";


/**
 * GET RESULTS BY POSITION
 *
 * Returns approved election results
 * for all candidates contesting a position.
 */
export async function positionResults(
    req: Request,
    res: Response
) {

    try {

        const electionId =
            String(req.params.electionId);

        const positionId =
            String(req.params.positionId);


        if (!electionId) {

            return res.status(400).json({

                success: false,

                message:
                    "Election ID is required"

            });

        }


        if (!positionId) {

            return res.status(400).json({

                success: false,

                message:
                    "Position ID is required"

            });

        }


        const results =
            await getResultsByPosition(
                electionId,
                positionId
            );


        const totalVotes =
            results.reduce(

                (
                    total: number,
                    candidate: {
                        votes: number;
                    }
                ) =>
                    total + candidate.votes,

                0

            );


        return res.json({

            success: true,

            data: {

                electionId,

                positionId,

                totalVotes,

                candidates: results

            }

        });

    } catch (error: unknown) {

        console.error(
            "Position results error:",
            error
        );


        const message =
            error instanceof Error
                ? error.message
                : "Failed to fetch position results";


        return res.status(500).json({

            success: false,

            message

        });

    }

}
