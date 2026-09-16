import { Request, Response } from "express";

import {
    getPendingResults,
    getResultForVerification,
    verifyResult,
    approveResult,
    rejectResult
} from "./result-verification.service";


// =========================================================
// GET PENDING RESULTS
// =========================================================

export async function pending(
    req: Request,
    res: Response
) {

    try {

        const electionId =
            Array.isArray(req.params.electionId)
                ? req.params.electionId[0]
                : req.params.electionId;


        if (!electionId) {

            return res.status(400).json({

                success: false,

                message: "Election ID is required"

            });

        }


        const results =
            await getPendingResults(electionId);


        return res.status(200).json({

            success: true,

            data: results

        });


    } catch (error: any) {

        console.error(
            "Pending results error:",
            error
        );


        return res.status(500).json({

            success: false,

            message:
                error?.message ||
                "Failed to fetch pending results"

        });

    }

}


// =========================================================
// GET RESULT FOR VERIFICATION
// =========================================================

export async function show(
    req: Request,
    res: Response
) {

    try {

        const id =
            Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;


        if (!id) {

            return res.status(400).json({

                success: false,

                message: "Result ID is required"

            });

        }


        const result =
            await getResultForVerification(id);


        return res.status(200).json({

            success: true,

            data: result

        });


    } catch (error: any) {

        console.error(
            "Get result error:",
            error
        );


        return res.status(404).json({

            success: false,

            message:
                error?.message ||
                "Result not found"

        });

    }

}


// =========================================================
// VERIFY RESULT
// =========================================================

export async function verify(
    req: Request,
    res: Response
) {

    try {

        const id =
            Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;


        if (!id) {

            return res.status(400).json({

                success: false,

                message: "Result ID is required"

            });

        }


        const result =
            await verifyResult(

                id,

                {
                    verifiedBy:
                        req.body?.verifiedBy ?? null
                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Result verified successfully",

            data: result

        });


    } catch (error: any) {

        console.error(
            "Verify result error:",
            error
        );


        return res.status(400).json({

            success: false,

            message:
                error?.message ||
                "Failed to verify result"

        });

    }

}


// =========================================================
// APPROVE RESULT
// =========================================================

export async function approve(
    req: Request,
    res: Response
) {

    try {

        const id =
            Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;


        if (!id) {

            return res.status(400).json({

                success: false,

                message: "Result ID is required"

            });

        }


        const result =
            await approveResult(

                id,

                {
                    approvedBy:
                        req.body?.approvedBy ?? null
                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Result approved successfully",

            data: result

        });


    } catch (error: any) {

        console.error(
            "Approve result error:",
            error
        );


        return res.status(400).json({

            success: false,

            message:
                error?.message ||
                "Failed to approve result"

        });

    }

}


// =========================================================
// REJECT RESULT
// =========================================================

export async function reject(
    req: Request,
    res: Response
) {

    try {

        const id =
            Array.isArray(req.params.id)
                ? req.params.id[0]
                : req.params.id;


        if (!id) {

            return res.status(400).json({

                success: false,

                message: "Result ID is required"

            });

        }


        const result =
            await rejectResult(

                id,

                {
                    rejectedBy:
                        req.body?.rejectedBy ?? null,

                    reason:
                        req.body?.reason ?? null
                }

            );


        return res.status(200).json({

            success: true,

            message:
                "Result rejected successfully",

            data: result

        });


    } catch (error: any) {

        console.error(
            "Reject result error:",
            error
        );


        return res.status(400).json({

            success: false,

            message:
                error?.message ||
                "Failed to reject result"

        });

    }

}
