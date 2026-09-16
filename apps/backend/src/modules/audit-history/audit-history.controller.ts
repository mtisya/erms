import {
    Request,
    Response
} from "express";

import {
    getAuditHistory,
    getResultAuditHistory,
    getVerificationHistory
} from "./audit-history.service";

function getSingleParamValue(
    value: string | string[] | undefined
): string | undefined {
    return Array.isArray(value) ? value[0] : value;
}

/**
 * GET ALL AUDIT HISTORY
 */
export async function index(
    req: Request,
    res: Response
) {

    try {

        const page =
            Number(req.query.page) || 1;

        const limit =
            Number(req.query.limit) || 20;


        const result =
            await getAuditHistory(
                page,
                limit
            );


        return res.json({

            success: true,

            data: result.records,

            pagination:
                result.pagination

        });

    } catch (error: any) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch audit history"

        });

    }

}


/**
 * GET AUDIT HISTORY FOR RESULT
 */
export async function resultHistory(
    req: Request,
    res: Response
) {

    try {

        const resultId =
            getSingleParamValue(req.params.resultId);


        if (!resultId) {

            return res.status(400).json({

                success: false,

                message:
                    "Result ID is required"

            });

        }


        const history =
            await getResultAuditHistory(
                resultId
            );


        return res.json({

            success: true,

            data: history

        });

    } catch (error: any) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch result audit history"

        });

    }

}


/**
 * GET VERIFICATION HISTORY
 */
export async function verificationHistory(
    req: Request,
    res: Response
) {

    try {

        const resultId =
            getSingleParamValue(req.params.resultId);


        if (!resultId) {

            return res.status(400).json({

                success: false,

                message:
                    "Result ID is required"

            });

        }


        const history =
            await getVerificationHistory(
                resultId
            );


        return res.json({

            success: true,

            data: history

        });

    } catch (error: any) {

        console.error(error);

        return res.status(500).json({

            success: false,

            message:
                error.message ||
                "Failed to fetch verification history"

        });

    }

}