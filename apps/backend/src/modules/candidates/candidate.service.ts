import { prismaAudit } from "../../config/prisma.audit";

const prismaAuditClient = prismaAudit as any;

import {
    CreateCandidateInput,
    UpdateCandidateInput
} from "./candidate.types";


export async function createCandidate(
    data: CreateCandidateInput
){

    return await prismaAuditClient.candidate.create({

        data

    });

}



export async function getCandidates(
    electionId:string
){

    return await prismaAuditClient.candidate.findMany({

        where:{
            electionId
        },

        include:{
            position:true
        }

    });

}



export async function getCandidateById(
    id:string
){

    return await prismaAuditClient.candidate.findUnique({

        where:{
            id
        },

        include:{
            position:true,
            election:true
        }

    });

}



export async function updateCandidate(
    id:string,
    data:UpdateCandidateInput
){

    return await prismaAuditClient.candidate.update({

        where:{
            id
        },

        data

    });

}



export async function deleteCandidate(
    id:string
){

    return await prismaAuditClient.candidate.delete({

        where:{
            id
        }

    });

}