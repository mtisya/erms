import { prismaAudit } from "../../config/prisma.audit";


export async function createConstituency(
    data:any
){

    return await prismaAudit.constituency.create({

        data

    });

}



export async function getConstituencies(){

    return await prismaAudit.constituency.findMany({

        include:{
            county:true,
            wards:true
        }

    });

}