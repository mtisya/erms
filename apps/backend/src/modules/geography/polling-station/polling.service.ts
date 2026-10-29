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
    id: string,
    data: UpdatePollingStationInput,
) {
    const station = await prisma.pollingStation.findUnique({
        where: { id },
    });

    if (!station) {
        throw new Error("Polling station not found");
    }

    const name = data.name?.trim();
    const code = data.code?.trim();

    if (
        (name !== undefined && name.length < 2) ||
        (code !== undefined && code.length < 2)
    ) {
        throw new Error(
            "Polling station name and code must contain at least 2 characters.",
        );
    }

    if (name !== undefined || code !== undefined) {
        const existing = await prisma.pollingStation.findFirst({
            where: {
                id: { not: id },
                OR: [
                    ...(name !== undefined ? [{ name }] : []),
                    ...(code !== undefined ? [{ code }] : []),
                ],
            },
        });

        if (existing) {
            throw new Error(
                "Polling station name or code already exists",
            );
        }
    }

    return prisma.pollingStation.update({
        where: { id },
        data: {
            ...(name !== undefined ? { name } : {}),
            ...(code !== undefined ? { code } : {}),
            ...(data.registeredVoters !== undefined
                ? { registeredVoters: data.registeredVoters }
                : {}),
        },
    });
}

export async function deletePollingStation(id: string) {
    const station = await prisma.pollingStation.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    results: true,
                    userScopes: true,
                },
            },
        },
    });

    if (!station) {
        throw new Error("Polling station not found");
    }

    if (
        station._count.results > 0 ||
        station._count.userScopes > 0
    ) {
        throw new Error(
            "Cannot delete this polling station because it has associated election results or user scopes.",
        );
    }

    return prisma.pollingStation.delete({
        where: { id },
    });
}
