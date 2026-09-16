import { Request, Response } from "express";

import {
    createCounty
} from "./county.service";


export async function createCountyController(
    req:Request,
    res:Response
){

    try {

        const county = await createCounty(req.body);


        return res.json({

            success:true,

            data:county

        });


    } catch(error){

        console.error(error);

        return res.status(500).json({

            success:false,

            message:"Failed to create county"

        });

    }

}