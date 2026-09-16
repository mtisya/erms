import prisma from "./prisma";
import { auditExtension } from "../database/prisma.audit";


export const prismaAudit =
    prisma.$extends(
        auditExtension()
    );
