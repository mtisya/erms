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
    id: string,
    data: UpdateWardInput,
) {
    const ward = await prisma.ward.findUnique({
        where: { id },
    });

    if (!ward) {
        throw new Error("Ward not found");
    }

    const name = data.name?.trim();
    const code = data.code?.trim();

    if (
        (name !== undefined && name.length < 2) ||
        (code !== undefined && code.length < 2)
    ) {
        throw new Error(
            "Ward name and code must contain at least 2 characters.",
        );
    }

    if (name !== undefined || code !== undefined) {
        const existing = await prisma.ward.findFirst({
            where: {
                id: { not: id },
                OR: [
                    ...(name !== undefined ? [{ name }] : []),
                    ...(code !== undefined ? [{ code }] : []),
                ],
            },
        });

        if (existing) {
            throw new Error("Ward name or code already exists");
        }
    }

    return prisma.ward.update({
        where: { id },
        data: {
            ...(name !== undefined ? { name } : {}),
            ...(code !== undefined ? { code } : {}),
        },
    });
}

export async function deleteWard(id: string) {
    const ward = await prisma.ward.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    pollingStations: true,
                    userScopes: true,
                },
            },
        },
    });

    if (!ward) {
        throw new Error("Ward not found");
    }

    if (
        ward._count.pollingStations > 0 ||
        ward._count.userScopes > 0
    ) {
        throw new Error(
            "Cannot delete this ward because it has associated polling stations or user scopes.",
        );
    }

    return prisma.ward.delete({
        where: { id },
    });
}
