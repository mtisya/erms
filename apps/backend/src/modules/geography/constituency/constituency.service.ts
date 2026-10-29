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
    id: string,
    data: UpdateConstituencyInput,
) {
    const constituency = await prisma.constituency.findUnique({
        where: { id },
    });

    if (!constituency) {
        throw new Error("Constituency not found");
    }

    const name = data.name?.trim();
    const code = data.code?.trim();

    if (
        (name !== undefined && name.length < 2) ||
        (code !== undefined && code.length < 2)
    ) {
        throw new Error(
            "Constituency name and code must contain at least 2 characters.",
        );
    }

    if (name !== undefined || code !== undefined) {
        const existing = await prisma.constituency.findFirst({
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
                "Constituency name or code already exists",
            );
        }
    }

    return prisma.constituency.update({
        where: { id },
        data: {
            ...(name !== undefined ? { name } : {}),
            ...(code !== undefined ? { code } : {}),
        },
    });
}

export async function deleteConstituency(id: string) {
    const constituency = await prisma.constituency.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    wards: true,
                    userScopes: true,
                },
            },
        },
    });

    if (!constituency) {
        throw new Error("Constituency not found");
    }

    if (
        constituency._count.wards > 0 ||
        constituency._count.userScopes > 0
    ) {
        throw new Error(
            "Cannot delete this constituency because it has associated wards or user scopes.",
        );
    }

    return prisma.constituency.delete({
        where: { id },
    });
}
