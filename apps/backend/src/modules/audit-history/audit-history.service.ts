import { prismaAudit } from "../../config/prisma.audit";

const db = prismaAudit;


/**
 * GET AUDIT HISTORY FOR A RESULT
 */
export async function getResultAuditHistory(
    resultId: string
) {

    return db.auditLog.findMany({

        where: {
            module: "Result",
            recordId: resultId
        },

        orderBy: {
            createdAt: "desc"
        }

    });

}


/**
 * GET VERIFICATION HISTORY
 */
export async function getVerificationHistory(
    resultId: string
) {

    return db.auditLog.findMany({

        where: {
            module: "Result",
            recordId: resultId,
            action: "UPDATE"
        },

        orderBy: {
            createdAt: "desc"
        }

    });

}


/**
 * GET ALL AUDIT HISTORY
 */
export async function getAuditHistory(
    page = 1,
    limit = 20
) {

    const skip =
        (page - 1) * limit;


    const [records, total] =
        await Promise.all([

            db.auditLog.findMany({

                skip,

                take: limit,

                orderBy: {
                    createdAt: "desc"
                }

            }),

            db.auditLog.count()

        ]);


    return {

        records,

        pagination: {

            page,

            limit,

            total,

            totalPages:
                Math.ceil(total / limit)

        }

    };

}