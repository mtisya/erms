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
    id: string,
    data: UpdateCountyInput
) {
    const county = await prisma.county.findUnique({
        where: { id },
    });

    if (!county) {
        throw new Error("County not found");
    }

    const name = data.name?.trim();
    const code = data.code?.trim();

    if (name === "" || code === "") {
        throw new Error("County name and code cannot be empty");
    }

    if (name || code) {
        const existing = await prisma.county.findFirst({
            where: {
                id: { not: id },
                OR: [
                    ...(name ? [{ name }] : []),
                    ...(code ? [{ code }] : []),
                ],
            },
        });

        if (existing) {
            throw new Error("County name or code already exists");
        }
    }

    return prisma.county.update({
        where: { id },
        data: {
            ...(name !== undefined ? { name } : {}),
            ...(code !== undefined ? { code } : {}),
        },
    });
}

export async function deleteCounty(id: string) {
    const county = await prisma.county.findUnique({
        where: { id },
        include: {
            _count: {
                select: {
                    constituencies: true,
                    userScopes: true,
                },
            },
        },
    });

    if (!county) {
        throw new Error("County not found");
    }

    if (
        county._count.constituencies > 0 ||
        county._count.userScopes > 0
    ) {
        throw new Error(
            "Cannot delete this county because it has associated constituencies or user scopes."
        );
    }

    await prisma.county.delete({
        where: { id },
    });
}
