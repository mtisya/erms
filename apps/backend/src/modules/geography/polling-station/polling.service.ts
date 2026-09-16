import prisma from "../../../config/prisma";

import {
    CreatePollingStationInput,
    UpdatePollingStationInput
} from "./polling.types";



export async function getPollingStations(){

    return prisma.pollingStation.findMany({

        include:{

            ward:{

                include:{

                    constituency:{

                        include:{

                            county:true

                        }

                    }

                }

            }

        },

        orderBy:{

            name:"asc"

        }

    });

}




export async function getPollingStationById(
    id:string
){

    return prisma.pollingStation.findUnique({

        where:{
            id
        },

        include:{

            ward:true

        }

    });

}




export async function createPollingStation(
    data:CreatePollingStationInput
){

    const existing =
        await prisma.pollingStation.findFirst({

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
            "Polling station name or code already exists"
        );

    }



    return prisma.pollingStation.create({

        data

    });

}




export async function updatePollingStation(
    id:string,
    data:UpdatePollingStationInput
){

    return prisma.pollingStation.update({

        where:{
            id
        },

        data

    });

}




export async function deletePollingStation(
    id:string
){

    return prisma.pollingStation.delete({

        where:{
            id
        }

    });

}