import { Prisma } from "@prisma/client";
import prisma from "../../config/prisma";

import {
    CreateAuditLogInput
} from "./audit.types";



export async function createAuditLog(
    data: CreateAuditLogInput
) {

    return prisma.auditLog.create({

        data: {

            userId:
                data.userId ?? null,

            action:
                data.action,

            module:
                data.module,

            recordId:
                data.recordId,

            oldData:
                data.oldData,

            newData:
                data.newData,

            ipAddress:
                data.ipAddress ?? null,

            userAgent:
                data.userAgent ?? null

        } as Prisma.AuditLogUncheckedCreateInput

    });

}



export async function getAuditLogs() {

    return prisma.auditLog.findMany({

        include: {

            user: {

                select: {

                    id: true,

                    firstName: true,

                    lastName: true,

                    email: true

                }

            }

        },

        orderBy: {

            createdAt: "desc"

        }

    });

}