
import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as electionService from "./election.service";

export async function createElection(
    req: Request,
    res: Response
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const election = await electionService.createElection(
        req.body
    );

    return res.status(201).json({
        success: true,
        data: election,
    });
}

export async function getElections(
    _req: Request,
    res: Response
) {
    const elections = await electionService.getElections();

    return res.json({
        success: true,
        data: elections,
    });
}

export async function getElectionById(
    req: Request,
    res: Response
) {
    const election = await electionService.getElectionById(
        req.params.id as string
    );

    return res.json({
        success: true,
        data: election,
    });
}

export async function updateElection(
    req: Request,
    res: Response
) {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array(),
        });
    }

    const election = await electionService.updateElection(
        req.params.id as string,
        req.body
    );

    return res.json({
        success: true,
        data: election,
    });
}

export async function deleteElection(
    req: Request,
    res: Response
) {
    await electionService.deleteElection(
        req.params.id as string
    );

    return res.json({
        success: true,
        message: "Election deleted successfully",
    });
}
