import { prismaAudit } from "../../config/prisma.audit";

import {
    CreateElectionPositionInput,
    UpdateElectionPositionInput
} from "./electionPosition.types";

const prismaAuditClient = prismaAudit as any;
const electionPositionClient = prismaAuditClient.electionPosition;

export async function createPosition(
    data: CreateElectionPositionInput
) {

    return await electionPositionClient.create({

        data

    });

}



export async function getPositions(
    electionId: string
) {

    return await electionPositionClient.findMany({

        where: {

            electionId

        },

        include: {

            candidates: true

        }

    });

}



export async function getPositionById(
    id:string
) {

    return await electionPositionClient.findUnique({

        where:{
            id
        },

        include:{
            candidates:true
        }

    });

}



export async function updatePosition(
    id:string,
    data:UpdateElectionPositionInput
){

    return await electionPositionClient.update({

        where:{
            id
        },

        data

    });

}



export async function deletePosition(
    id:string
){

    return await electionPositionClient.delete({

        where:{
            id
        }

    });

}