import { prismaAudit } from "../../config/prisma.audit";

import {
    CreateResultInput,
    UpdateResultInput
} from "./result.types";


const db = prismaAudit;



// CREATE RESULT

export async function createResult(
    data: CreateResultInput
) {


    const candidate = await db.candidate.findUnique({

        where:{
            id:data.candidateId
        }

    });


    if(!candidate){

        throw new Error(
            "Candidate does not exist"
        );

    }



    if(candidate.electionId !== data.electionId){

        throw new Error(
            "Candidate does not belong to this election"
        );

    }




    const election = await db.election.findUnique({

        where:{
            id:data.electionId
        }

    });



    if(!election){

        throw new Error(
            "Election does not exist"
        );

    }





    const station = await db.pollingStation.findUnique({

        where:{
            id:data.pollingStationId
        }

    });



    if(!station){

        throw new Error(
            "Polling station does not exist"
        );

    }





    const existing = await db.result.findFirst({

        where:{
            candidateId:data.candidateId,
            pollingStationId:data.pollingStationId
        }

    });



    if(existing){

        throw new Error(
            "Result already exists for this candidate at this polling station"
        );

    }





    return db.result.create({

        data,

        include:{

            election:true,

            candidate:true,

            pollingStation:true

        }

    });


}





// GET ALL RESULTS


export async function getResults(){


    return db.result.findMany({

        include:{

            election:true,

            candidate:true,

            pollingStation:true

        },

        orderBy:{

            createdAt:"desc"

        }

    });


}





// GET SINGLE RESULT


export async function getResultById(
    id:string
){


    return db.result.findUnique({

        where:{
            id
        },


        include:{

            election:true,

            candidate:true,

            pollingStation:true

        }

    });


}





// UPDATE RESULT


export async function updateResult(

    id:string,

    data:UpdateResultInput

){


    const result = await db.result.findUnique({

        where:{
            id
        }

    });



    if(!result){

        throw new Error(
            "Result not found"
        );

    }



    return db.result.update({

        where:{
            id
        },


        data,


        include:{

            election:true,

            candidate:true,

            pollingStation:true

        }

    });


}







// DELETE RESULT


export async function deleteResult(

    id:string

){


    const result = await db.result.findUnique({

        where:{
            id
        }

    });



    if(!result){

        throw new Error(
            "Result not found"
        );

    }



    return db.result.delete({

        where:{
            id
        }

    });


}