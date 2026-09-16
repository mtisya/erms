import { Request, Response } from "express";

import * as service from "./ward.service";



export async function listWards(
    _req:Request,
    res:Response
){

    const data =
        await service.getWards();


    res.json({

        success:true,

        data

    });

}




export async function getWard(
    req:Request<{id:string}>,
    res:Response
){

    const data =
        await service.getWardById(
            req.params.id
        );


    if(!data){

        return res.status(404).json({

            success:false,

            message:"Ward not found"

        });

    }


    res.json({

        success:true,

        data

    });

}





export async function createWard(
    req:Request,
    res:Response
){

    try{


        const data =
            await service.createWard(
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