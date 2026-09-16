import prisma from "../../config/prisma";

import {
    comparePassword
} from "./password.service";

import {
    generateAccessToken
} from "./token.service";

import {
    LoginRequest,
    AuthResponse
} from "./auth.types";



export async function login(
    data: LoginRequest
): Promise<AuthResponse> {


    const user = await prisma.user.findUnique({

        where: {

            email: data.email

        },

        include: {

            role: true

        }

    });



    if(!user){

        throw new Error(
            "Invalid email or password"
        );

    }



    const passwordMatch =
        await comparePassword(
            data.password,
            user.password
        );



    if(!passwordMatch){

        throw new Error(
            "Invalid email or password"
        );

    }



    const token = generateAccessToken({

        userId: user.id,

        email: user.email,

        role: user.role.name

    });



    return {

        token,

        user: {

            id: user.id,

            firstName: user.firstName,

            lastName: user.lastName,

            email: user.email,

            role: user.role.name

        }

    };

}