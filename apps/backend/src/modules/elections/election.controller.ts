    import { Request, Response } from "express";
    import * as electionService from "./election.service";


    export async function createElection(
        req: Request,
        res: Response
    ) {

        const election = await electionService.createElection(
            req.body
        );

        res.status(201).json({

            success: true,

            data: election

        });

    }


    export async function getElections(
        _req: Request,
        res: Response
    ) {

        const elections = await electionService.getElections();

        res.json({

            success: true,

            data: elections

        });

    }


    export async function getElectionById(
        req: Request,
        res: Response
    ) {

        const election = await electionService.getElectionById(
            req.params.id as string
        );

        res.json({

            success: true,

            data: election

        });

    }


    export async function updateElection(
        req: Request,
        res: Response
    ) {

        const election = await electionService.updateElection(

            req.params.id as string,

            req.body

        );

        res.json({

            success: true,

            data: election

        });

    }


    export async function deleteElection(
        req: Request,
        res: Response
    ) {

        await electionService.deleteElection(
            req.params.id as string
        );

        res.json({

            success: true,

            message: "Election deleted successfully"

        });

    }