import prisma from "../../config/prisma";

import {
    ResultAuditFilters
} from "./result-audit.types";


const db = prisma;


/**
 * GET RESULT AUDIT HISTORY
 *
 * Returns audit history for result records.
 */
export async function getResultAuditHistory(
    filters: ResultAuditFilters = {}
) {

    const {
        electionId,
        resultId,
        candidateId,
        pollingStationId,
        action,
        page = 1,
        limit = 50
    } = filters;


    const skip =
        (page - 1) * limit;


    const where: any = {

        module: "Result"

    };


    /**
     * Filter by result ID
     */
    if (resultId) {

        where.recordId =
            resultId;

    }


    /**
     * Filter by action
     */
    if (action) {

        where.action =
            action;

    }


    /**
     * We cannot directly filter JSON audit
     * data reliably through the existing
     * audit structure.
     *
     * Therefore, when election/candidate/
     * polling station filters are required,
     * we first find matching Result IDs.
     */
    if (
        electionId ||
        candidateId ||
        pollingStationId
    ) {

        const results =
            await db.result.findMany({

                where: {

                    ...(electionId && {
                        electionId
                    }),

                    ...(candidateId && {
                        candidateId
                    }),

                    ...(pollingStationId && {
                        pollingStationId
                    })

                },

                select: {
                    id: true
                }

            });


        const resultIds =
            results.map(
                result => result.id
            );


        where.recordId = {
            in: resultIds
        };

    }


    const [
        records,
        total
    ] = await Promise.all([

        db.auditLog.findMany({

            where,

            orderBy: {

                createdAt: "desc"

            },

            skip,

            take: limit

        }),


        db.auditLog.count({

            where

        })

    ]);


    return {

        records,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(
                    total / limit
                )

        }

    };

}


/**
 * GET AUDIT HISTORY FOR ONE RESULT
 */
export async function getResultHistory(
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

                pollingStation: true

            }

        });


    if (!result) {

        throw new Error(
            "Result not found"
        );

    }


    const history =
        await db.auditLog.findMany({

            where: {

                module: "Result",

                recordId: resultId

            },

            orderBy: {

                createdAt: "asc"

            }

        });


    return {

        result,

        history

    };

}


/**
 * GET ELECTION RESULT AUDIT HISTORY
 */
export async function getElectionResultHistory(
    electionId: string
) {

    const results =
        await db.result.findMany({

            where: {

                electionId

            },

            select: {

                id: true

            }

        });


    const resultIds =
        results.map(
            result => result.id
        );


    if (!resultIds.length) {

        return [];

    }


    return db.auditLog.findMany({

        where: {

            module: "Result",

            recordId: {

                in: resultIds

            }

        },

        orderBy: {

            createdAt: "desc"

        }

    });

}
