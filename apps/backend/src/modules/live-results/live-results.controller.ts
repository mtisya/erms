import { Request, Response } from "express";

import {
    getLiveResults
} from "./live-results.service";


export async function liveResults(
    req: Request,
    res: Response
) {

    try {

        const {
            electionId
        } = req.params;

        const electionIdStr = Array.isArray(electionId) ? electionId[0] : electionId;

        if (!electionIdStr) {

            return res.status(400).json({

                success: false,

                message:
                    "Election ID is required"

            });

        }


        const data =
            await getLiveResults(
                electionIdStr
            );


        return res.json({

            success: true,

            data

        });


    } catch (error: any) {

        console.error(
            "Live results error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch live results"

        });

    }

}

