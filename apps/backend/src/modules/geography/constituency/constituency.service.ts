import prisma from "../../../config/prisma";

import {
    CreateConstituencyInput,
    UpdateConstituencyInput
} from "./constituency.types";



export async function getConstituencies(){

    return prisma.constituency.findMany({

        include:{

            county:true,

            wards:true

        },

        orderBy:{

            name:"asc"

        }

    });

}



export async function getConstituencyById(
    id:string
){

    return prisma.constituency.findUnique({

        where:{
            id
        },

        include:{

            county:true,

            wards:true

        }

    });

}




export async function createConstituency(
    data:CreateConstituencyInput
){

    const existing =
        await prisma.constituency.findFirst({

            where:{

                OR:[

                    {
                        name:data.name
                    },

                    {
                        code:data.code
                    }

                ]

            }

        });


    if(existing){

        throw new Error(
            "Constituency name or code already exists"
        );

    }



    return prisma.constituency.create({

        data

    });

}




export async function updateConstituency(
    id:string,
    data:UpdateConstituencyInput
){

    return prisma.constituency.update({

        where:{
            id
        },

        data

    });

}




export async function deleteConstituency(
    id:string
){

    return prisma.constituency.delete({

        where:{
            id
        }

    });

}