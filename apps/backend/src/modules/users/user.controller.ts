import { Request, Response } from "express";

import * as userService from "./user.service";



export async function updateUser(
    req: Request<{ id:string }>,
    res: Response
){

    try{


        const user =
            await userService.updateUser(
                req.params.id,
                req.body
            );


        res.json({

            success:true,

            data:user

        });


    }catch(error:any){

        res.status(400).json({

            success:false,

            message:error.message

        });

    }

}

export async function deactivateUser(
    req: Request<{ id: string }>,
    res: Response
){

    try {

        await userService.deactivateUser(
            req.params.id
        );


        return res.json({

            success:true,

            message:"User deactivated"

        });


    } catch(error:any) {


        return res.status(400).json({

            success:false,

            message:error.message

        });

    }

}

export async function getUser(
    req: Request<{ id:string }>,
    res: Response
){

    try {


        const user =
            await userService.getUserById(
                req.params.id
            );


        if(!user){

            return res.status(404).json({

                success:false,

                message:"User not found"

            });

        }


        res.json({

            success:true,

            data:user

        });


    }catch(error:any){

        res.status(500).json({

            success:false,

            message:error.message

        });

    }

}

export async function listUsers(
    _req:Request,
    res:Response
){

    const users =
        await userService.getUsers();


    res.json({

        success:true,

        data:users

    });

}



export async function createUser(
    req:Request,
    res:Response
){

    try {


        const user =
            await userService.createUser(
                req.body
            );


        res.status(201).json({

            success:true,

            data:user

        });


    }catch(error:any){


        res.status(400).json({

            success:false,

            message:error.message

        });


    }

}