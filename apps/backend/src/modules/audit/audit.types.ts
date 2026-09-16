import { Prisma } from "@prisma/client";


export interface CreateAuditLogInput {

    userId?: string | null;

    action: string;

    module: string;

    recordId?: string;

    oldData?: Prisma.InputJsonValue;

    newData?: Prisma.InputJsonValue;

    ipAddress?: string | null;

    userAgent?: string | null;

}