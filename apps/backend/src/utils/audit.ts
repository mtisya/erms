import { Prisma } from "@prisma/client";
import * as auditService from "../modules/audit/audit.service";


interface AuditOptions {

    userId: string;

    action: string;

    module: string;

    recordId?: string;

    oldData?: Prisma.InputJsonValue;

    newData?: Prisma.InputJsonValue;

    ipAddress?: string;

    userAgent?: string;
}



export async function audit(
    options: AuditOptions
){

    await auditService.createAuditLog({

        userId: options.userId,

        action: options.action,

        module: options.module,

        recordId: options.recordId,

        oldData: options.oldData,

        newData: options.newData,

        ipAddress: options.ipAddress,

        userAgent: options.userAgent

    });

}