import { Request, Response } from "express";

import * as service from "./polling.service";



export async function listPollingStations(
    _req:Request,
    res:Response
){

    const data =
        await service.getPollingStations();


    res.json({

        success:true,

        data

    });

}




export async function createPollingStation(
    req:Request,
    res:Response
){

    try{


        const data =
            await service.createPollingStation(
                req.body
            );


        res.status(201).json({

            success:true,

            data

        });


    }catch(error:any){

        res.status(400).json({

            success:false,

            message:error.message

        });

    }

}