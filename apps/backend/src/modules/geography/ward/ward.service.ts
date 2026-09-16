import prisma from "../../../config/prisma";

import {
    CreateWardInput,
    UpdateWardInput
} from "./ward.types";



export async function getWards(){

    return prisma.ward.findMany({

        include:{

            constituency:true,

            pollingStations:true

        },

        orderBy:{

            name:"asc"

        }

    });

}



export async function getWardById(
    id:string
){

    return prisma.ward.findUnique({

        where:{
            id
        },

        include:{

            constituency:true,

            pollingStations:true

        }

    });

}




export async function createWard(
    data:CreateWardInput
){

    const existing =
        await prisma.ward.findFirst({

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
            "Ward name or code already exists"
        );

    }



    return prisma.ward.create({

        data

    });

}




export async function updateWard(
    id:string,
    data:UpdateWardInput
){

    return prisma.ward.update({

        where:{
            id
        },

        data

    });

}




export async function deleteWard(
    id:string
){

    return prisma.ward.delete({

        where:{
            id
        }

    });

}