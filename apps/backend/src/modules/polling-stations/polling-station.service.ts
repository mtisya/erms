import { prismaAudit } from "../../config/prisma.audit";

import {
    CreatePollingStationInput,
    UpdatePollingStationInput
} from "./polling-station.types";


const db = prismaAudit as any;



export async function createPollingStation(
    data: CreatePollingStationInput
) {

    return db.pollingStation.create({

        data

    });

}



export async function getPollingStations() {


    return db.pollingStation.findMany({

        include: {

            ward: {

                include: {

                    constituency: {

                        include: {

                            county: true

                        }

                    }

                }

            }

        },

        orderBy: {

            name: "asc"

        }

    });


}



export async function getPollingStationById(
    id:string
){

    return db.pollingStation.findUnique({

        where:{
            id
        },

        include:{

            ward:true

        }

    });

}



export async function updatePollingStation(
    id:string,
    data:UpdatePollingStationInput
){

    return db.pollingStation.update({

        where:{
            id
        },

        data

    });

}




export async function deletePollingStation(
    id:string
){

    return db.pollingStation.delete({

        where:{
            id
        }

    });

}