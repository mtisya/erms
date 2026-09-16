import { prismaAudit } from "../../config/prisma.audit";

import {
    emitResultsUpdated
} from "../../socket/results.socket";

import {
    VerifyResultInput,
    ApproveResultInput,
    RejectResultInput
} from "./result-verification.types";


const db = prismaAudit;


/**
 * GET PENDING RESULTS
 */
export async function getPendingResults(
    electionId: string
) {

    return db.result.findMany({

        where: {
            electionId,
            status: "pending"
        },

        include: {

            election: true,

            candidate: true,

            pollingStation: {

                include: {

                    ward: {

                        include: {

                            constituency: {

                                include: {

                                    county: true

                                }

                            }

                        }

                    }

                }

            }

        },

        orderBy: {
            createdAt: "asc"
        }

    });

}


/**
 * GET RESULT FOR VERIFICATION
 */
export async function getResultForVerification(
    resultId: string
) {

    const result =
        await db.result.findUnique({

            where: {
                id: resultId
            },

            include: {

                election: true,

                candidate: true,

                pollingStation: {

                    include: {

                        ward: {

                            include: {

                                constituency: {

                                    include: {

                                        county: true

                                    }

                                }

                            }

                        }

                    }

                }

            }

        });


    if (!result) {

        throw new Error(
            "Result not found"
        );

    }


    return result;

}


/**
 * VERIFY RESULT
 *
 * pending → verified
 */
export async function verifyResult(
    resultId: string,
    data: VerifyResultInput
) {

    const result =
        await db.result.findUnique({

            where: {
                id: resultId
            }

        });


    if (!result) {

        throw new Error(
            "Result not found"
        );

    }


    if (result.status === "verified") {

        throw new Error(
            "Result has already been verified"
        );

    }


    if (result.status === "approved") {

        throw new Error(
            "Approved results cannot be verified"
        );

    }


    if (result.status === "rejected") {

        throw new Error(
            "Rejected results cannot be verified"
        );

    }


    if (result.status !== "pending") {

        throw new Error(
            `Result cannot be verified from status: ${result.status}`
        );

    }


    const updatedResult = await db.result.update({

        where: {
            id: resultId
        },

        data: {

            status: "verified",

            verifiedBy:
                data?.verifiedBy ?? null,

            verifiedAt:
                new Date()

        },

        include: {

            election: true,

            candidate: true,

            pollingStation: true

        }

    });


    await emitResultsUpdated(
        updatedResult.electionId
    );


    return updatedResult;


    /*
     * Do NOT emit public live results here.
     *
     * The result is only verified at this stage.
     *
     * Public results are emitted after approval.
     */



}


/**
 * APPROVE RESULT
 *
 * verified → approved
 *
 * This is the point where the result becomes
 * eligible for public/live tallying.
 */
export async function approveResult(
    resultId: string,
    data: ApproveResultInput
) {

    const result =
        await db.result.findUnique({

            where: {
                id: resultId
            }

        });


    if (!result) {

        throw new Error(
            "Result not found"
        );

    }


    if (result.status === "approved") {

        throw new Error(
            "Result has already been approved"
        );

    }


    if (result.status !== "verified") {

        throw new Error(
            "Only verified results can be approved"
        );

    }


    const updatedResult = await db.result.update({

    where: {
        id: resultId
    },

    data: {

        status: "approved",

        approvedBy:
            data?.approvedBy ?? null,

        approvedAt:
            new Date()

    },

    include: {

        election: true,

        candidate: true,

        pollingStation: true

    }

});


await emitResultsUpdated(
    updatedResult.electionId
);


return updatedResult;
}


/**
 * REJECT RESULT
 *
 * pending/verified → rejected
 */
export async function rejectResult(
    resultId: string,
    data: RejectResultInput
) {

    const result =
        await db.result.findUnique({

            where: {
                id: resultId
            }

        });


    if (!result) {

        throw new Error(
            "Result not found"
        );

    }


    if (result.status === "approved") {

        throw new Error(
            "Approved results cannot be rejected"
        );

    }


    if (result.status === "rejected") {

        throw new Error(
            "Result has already been rejected"
        );

    }


    const updatedResult = await db.result.update({

    where: {
        id: resultId
    },

    data: {

        status: "rejected"

    },

    include: {

        election: true,

        candidate: true,

        pollingStation: true

    }

});


await emitResultsUpdated(
    updatedResult.electionId
);


return updatedResult;

}
