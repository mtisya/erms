import {
    Request,
    Response
} from "express";

import {
    getPollingStationResults,
    getWardResults,
    getConstituencyResults,
    getCountyResults,
    getNationalResults
} from "./results-explorer.service";


export async function pollingStation(
    req: Request,
    res: Response
) {

    try {

        const {
            electionId,
            pollingStationId
        } = req.params as { electionId: string; pollingStationId: string };


        const data =
            await getPollingStationResults(
                electionId,
                pollingStationId
            );


        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


export async function ward(
    req: Request,
    res: Response
) {

    try {

        const {
            electionId,
            wardId
        } = req.params as { electionId: string; wardId: string };


        const data =
            await getWardResults(
                electionId,
                wardId
            );


        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


export async function constituency(
    req: Request,
    res: Response
) {

    try {

        const {
            electionId,
            constituencyId
        } = req.params as { electionId: string; constituencyId: string };


        const data =
            await getConstituencyResults(
                electionId,
                constituencyId
            );


        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


export async function county(
    req: Request,
    res: Response
) {

    try {

        const {
            electionId,
            countyId
        } = req.params as { electionId: string; countyId: string };


        const data =
            await getCountyResults(
                electionId,
                countyId
            );


        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}


export async function national(
    req: Request,
    res: Response
) {

    try {

        const {
            electionId
        } = req.params as { electionId: string };


        const data =
            await getNationalResults(
                electionId
            );


        return res.json({

            success: true,

            data

        });

    } catch (error: any) {

        return res.status(400).json({

            success: false,

            message: error.message

        });

    }

}