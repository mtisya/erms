import prisma from "../../config/prisma";
import { prismaAudit } from "../../config/prisma.audit";

import {
    hashPassword
} from "../auth/password.service";

import {
    CreateUserInput,
    UpdateUserInput
} from "./user.types";



export async function getUserById(
    id:string
){

    return prisma.user.findUnique({

        where:{
            id
        },

        select:{

            id:true,

            firstName:true,

            lastName:true,

            email:true,

            active:true,

            createdAt:true,

            updatedAt:true,

            role:true

        }

    });

}



export async function getUsers(){

    return prisma.user.findMany({

        select:{

            id:true,

            firstName:true,

            lastName:true,

            email:true,

            active:true,

            createdAt:true,

            updatedAt:true,

            role:true

        },

        orderBy:{

            createdAt:"desc"

        }

    });

}



export async function createUser(
    data:CreateUserInput
){

    const existing =
        await prisma.user.findUnique({

            where:{
                email:data.email
            }

        });



    if(existing){

        throw new Error(
            "Email already exists"
        );

    }



    const password =
        await hashPassword(
            data.password
        );



    return prismaAudit.user.create({

        data:{

            firstName:data.firstName,

            lastName:data.lastName,

            email:data.email,

            password,

            roleId:data.roleId

        },

        include:{

            role:true

        }

    });

}





export async function updateUser(
    id:string,
    data:UpdateUserInput
){

    return prismaAudit.user.update({

        where:{
            id
        },

        data,

        select:{

            id:true,

            firstName:true,

            lastName:true,

            email:true,

            active:true,

            role:true

        }

    });

}





export async function deactivateUser(
    id:string
){

    return prismaAudit.user.update({

        where:{
            id
        },

        data:{

            active:false

        }

    });

}





export async function deleteUser(
    id:string
){

    return prismaAudit.user.update({

        where:{
            id
        },

        data:{

            active:false

        }

    });

}