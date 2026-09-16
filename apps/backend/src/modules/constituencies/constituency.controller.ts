import { Request, Response } from "express";

import {
    createConstituency
} from "./constituency.service";


export async function createConstituencyController(
    req:Request,
    res:Response
){

    try {

        const constituency =
            await createConstituency(req.body);


        return res.json({

            success:true,

            data:constituency

        });


    }catch(error){

        console.error(error);


        return res.status(500).json({

            success:false,

            message:"Failed to create constituency"

        });

    }

}