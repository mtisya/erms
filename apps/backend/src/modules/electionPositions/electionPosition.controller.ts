import { Request, Response } from "express";

import * as service from "./electionPosition.service";


export async function createPosition(
    req:Request,
    res:Response
){

    try {

        const position =
            await service.createPosition(req.body);


        return res.json({

            success:true,

            data:position

        });


    } catch(error){

        return res.status(500).json({

            success:false,

            message:"Failed to create position"

        });

    }

}