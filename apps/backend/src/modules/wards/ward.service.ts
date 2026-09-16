import { prismaAudit } from "../../config/prisma.audit";

import {
    CreateWardInput
} from "./ward.types";


export async function createWard(
    data: CreateWardInput
){

    return await prismaAudit.ward.create({

        data

    });

}



export async function getWards(
    constituencyId?: string
){

    return await prismaAudit.ward.findMany({

        where: constituencyId ? {
            constituencyId
        } : undefined,


        include:{
            constituency:true,
            pollingStations:true
        }

    });

}