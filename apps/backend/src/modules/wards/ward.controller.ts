import { Request, Response } from "express";

import {
    createWard
} from "./ward.service";


export async function createWardController(
    req:Request,
    res:Response
){

    try {

        const ward = await createWard(req.body);


        return res.json({

            success:true,

            data:ward

        });


    } catch(error){

        console.error(error);


        return res.status(500).json({

            success:false,

            message:"Failed to create ward"

        });

    }

}