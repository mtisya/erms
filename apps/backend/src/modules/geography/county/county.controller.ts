import { Request, Response } from "express";

import * as countyService from "./county.service";



export async function listCounties(
    _req:Request,
    res:Response
){

    const counties =
        await countyService.getCounties();


    res.json({

        success:true,

        data:counties

    });

}




export async function getCounty(
    req:Request<{id:string}>,
    res:Response
){

    const county =
        await countyService.getCountyById(
            req.params.id
        );


    if(!county){

        return res.status(404).json({

            success:false,

            message:"County not found"

        });

    }



    res.json({

        success:true,

        data:county

    });

}





export async function createCounty(
    req:Request,
    res:Response
){

    try{


        const county =
            await countyService.createCounty(
                req.body
            );


        res.status(201).json({

            success:true,

            data:county

        });



    }catch(error:any){


        res.status(400).json({

            success:false,

            message:error.message

        });


    }

}





export async function updateCounty(
    req:Request<{id:string}>,
    res:Response
){

    const county =
        await countyService.updateCounty(

            req.params.id,

            req.body

        );


    res.json({

        success:true,

        data:county

    });

}





export async function deleteCounty(
    req:Request<{id:string}>,
    res:Response
){

    await countyService.deleteCounty(
        req.params.id
    );


    res.json({

        success:true,

        message:"County deleted"

    });

}