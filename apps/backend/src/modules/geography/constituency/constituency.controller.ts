import { Request, Response } from "express";

import * as service from "./constituency.service";



export async function listConstituencies(
    _req:Request,
    res:Response
){

    const data =
        await service.getConstituencies();


    res.json({

        success:true,

        data

    });

}




export async function getConstituency(
    req:Request<{id:string}>,
    res:Response
){

    const data =
        await service.getConstituencyById(
            req.params.id
        );


    if(!data){

        return res.status(404).json({

            success:false,

            message:"Constituency not found"

        });

    }


    res.json({

        success:true,

        data

    });

}





export async function createConstituency(
    req:Request,
    res:Response
){

    try{

        const data =
            await service.createConstituency(
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