import { Request, Response } from "express";

import {
    getPollingStationTally,
    getWardTally,
    getConstituencyTally,
    getCountyTally,
    getNationalTally
} from "./tally.service";


/**
 * POLLING STATION TALLY
 *
 * GET /api/tally/polling-station/:electionId/:pollingStationId
 */
export async function pollingStation(
    req: Request<{ electionId: string; pollingStationId: string }>,
    res: Response
) {
    try {

        const {
            electionId,
            pollingStationId
        } = req.params;


        if (!electionId) {
            return res.status(400).json({
                success: false,
                message: "Election ID is required"
            });
        }


        if (!pollingStationId) {
            return res.status(400).json({
                success: false,
                message: "Polling station ID is required"
            });
        }


        const data =
            await getPollingStationTally(
                electionId,
                pollingStationId
            );


        return res.json({
            success: true,
            data
        });

    } catch (error: any) {

        console.error(
            "Polling station tally error:",
            error
        );


        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch polling station tally"
        });

    }
}


/**
 * WARD TALLY
 *
 * GET /api/tally/ward/:electionId/:wardId
 */
export async function ward(
    req: Request<{ electionId: string; wardId: string }>,
    res: Response
) {
    try {

        const {
            electionId,
            wardId
        } = req.params;


        if (!electionId || !wardId) {
            return res.status(400).json({
                success: false,
                message:
                    "Election ID and ward ID are required"
            });
        }


        const data =
            await getWardTally(
                electionId,
                wardId
            );


        return res.json({
            success: true,
            data
        });

    } catch (error: any) {

        console.error(
            "Ward tally error:",
            error
        );


        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch ward tally"
        });

    }
}


/**
 * CONSTITUENCY TALLY
 *
 * GET /api/tally/constituency/:electionId/:constituencyId
 */
export async function constituency(
    req: Request<{ electionId: string; constituencyId: string }>,
    res: Response
) {
    try {

        const {
            electionId,
            constituencyId
        } = req.params;


        if (!electionId || !constituencyId) {
            return res.status(400).json({
                success: false,
                message:
                    "Election ID and constituency ID are required"
            });
        }


        const data =
            await getConstituencyTally(
                electionId,
                constituencyId
            );


        return res.json({
            success: true,
            data
        });

    } catch (error: any) {

        console.error(
            "Constituency tally error:",
            error
        );


        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch constituency tally"
        });

    }
}


/**
 * COUNTY TALLY
 *
 * GET /api/tally/county/:electionId/:countyId
 */
export async function county(
    req: Request<{ electionId: string; countyId: string }>,
    res: Response
) {
    try {

        const {
            electionId,
            countyId
        } = req.params;


        if (!electionId || !countyId) {
            return res.status(400).json({
                success: false,
                message:
                    "Election ID and county ID are required"
            });
        }


        const data =
            await getCountyTally(
                electionId,
                countyId
            );


        return res.json({
            success: true,
            data
        });

    } catch (error: any) {

        console.error(
            "County tally error:",
            error
        );


        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch county tally"
        });

    }
}


/**
 * NATIONAL TALLY
 *
 * GET /api/tally/national/:electionId
 */
export async function national(
    req: Request<{ electionId: string }>,
    res: Response
) {
    try {

        const { electionId } = req.params;


        if (!electionId) {
            return res.status(400).json({
                success: false,
                message:
                    "Election ID is required"
            });
        }


        const data =
            await getNationalTally(
                electionId
            );


        return res.json({
            success: true,
            data
        });

    } catch (error: any) {

        console.error(
            "National tally error:",
            error
        );


        return res.status(400).json({
            success: false,
            message:
                error.message ||
                "Failed to fetch national tally"
        });

    }
}
