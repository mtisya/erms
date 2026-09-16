import { Request, Response } from "express";

import {
    createCandidate as createCandidateService,
    getCandidates as getCandidatesService,
    getCandidateById as getCandidateByIdService,
    updateCandidate as updateCandidateService,
    deleteCandidate as deleteCandidateService
} from "./candidate.service";

function getRouteParamId(value: string | string[] | undefined): string {
    if (Array.isArray(value)) {
        return value[0] ?? "";
    }

    return value ?? "";
}


// ==================================================
// CREATE CANDIDATE
// ==================================================

export async function createCandidate(
    req: Request,
    res: Response
) {

    try {

        const candidate =
            await createCandidateService(
                req.body
            );


        return res.status(201).json({

            success: true,

            data: candidate

        });


    } catch (error: any) {

        console.error(
            "Create candidate error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to create candidate"

        });

    }

}


// ==================================================
// GET CANDIDATES
// GET /api/candidates?electionId=...
// ==================================================

export async function getCandidates(
    req: Request,
    res: Response
) {

    try {

        const electionId =
            req.query.electionId as string;


        if (!electionId) {

            return res.status(400).json({

                success: false,

                message:
                    "Election ID is required"

            });

        }


        const candidates =
            await getCandidatesService(
                electionId
            );


        return res.json({

            success: true,

            data: candidates

        });


    } catch (error: any) {

        console.error(
            "Get candidates error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to load candidates"

        });

    }

}


// ==================================================
// GET SINGLE CANDIDATE
// ==================================================

export async function getCandidateById(
    req: Request,
    res: Response
) {

    try {

        const candidateId = getRouteParamId(req.params.id);

        const candidate =
            await getCandidateByIdService(
                candidateId
            );


        if (!candidate) {

            return res.status(404).json({

                success: false,

                message:
                    "Candidate not found"

            });

        }


        return res.json({

            success: true,

            data: candidate

        });


    } catch (error: any) {

        console.error(
            "Get candidate error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to load candidate"

        });

    }

}


// ==================================================
// UPDATE CANDIDATE
// ==================================================

export async function updateCandidate(
    req: Request,
    res: Response
) {

    try {

        const candidateId = getRouteParamId(req.params.id);

        const candidate =
            await updateCandidateService(

                candidateId,

                req.body

            );


        return res.json({

            success: true,

            data: candidate

        });


    } catch (error: any) {

        console.error(
            "Update candidate error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to update candidate"

        });

    }

}


// ==================================================
// DELETE CANDIDATE
// ==================================================

export async function deleteCandidate(
    req: Request,
    res: Response
) {

    try {

        const candidateId = getRouteParamId(req.params.id);

        await deleteCandidateService(
            candidateId
        );


        return res.json({

            success: true,

            message:
                "Candidate deleted successfully"

        });


    } catch (error: any) {

        console.error(
            "Delete candidate error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to delete candidate"

        });

    }

}