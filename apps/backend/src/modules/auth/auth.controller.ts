import { Request, Response } from "express";

import {
    login
} from "./auth.service";



export async function loginController(
    req: Request,
    res: Response
){

    try {


        const result =
            await login(req.body);



        return res.json({

            success:true,

            data:result

        });


    } catch(error:any){


        return res.status(401)
        .json({

            success:false,

            message:error.message

        });


    }

}