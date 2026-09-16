import prisma from "../../../config/prisma";

import {
    CreateCountyInput,
    UpdateCountyInput
} from "./county.types";



export async function getCounties(){

    return prisma.county.findMany({

        include:{

            constituencies:true

        },

        orderBy:{

            name:"asc"

        }

    });

}



export async function getCountyById(
    id:string
){

    return prisma.county.findUnique({

        where:{
            id
        },

        include:{

            constituencies:{

                include:{

                    wards:true

                }

            }

        }

    });

}



export async function createCounty(
    data:CreateCountyInput
){

    const existing =
        await prisma.county.findFirst({

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
            "County name or code already exists"
        );

    }



    return prisma.county.create({

        data

    });

}



export async function updateCounty(
    id:string,
    data:UpdateCountyInput
){

    return prisma.county.update({

        where:{
            id
        },

        data

    });

}



export async function deleteCounty(
    id:string
){

    return prisma.county.delete({

        where:{
            id
        }

    });

}