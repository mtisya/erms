import { Request, Response } from "express";

import * as service from "./constituency.service";

import {
    createConstituencySchema,
    updateConstituencySchema,
} from "./constituency.validation";

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

export async function updateConstituency(
    req: Request<{ id: string }>,
    res: Response,
) {
    const validation = updateConstituencySchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues
                .map((issue) => issue.message)
                .join(", "),
        });
    }

    try {
        const data = await service.updateConstituency(
            req.params.id,
            validation.data,
        );

        return res.json({
            success: true,
            data,
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unable to update constituency.";

        const status = message === "Constituency not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message,
        });
    }
}

export async function deleteConstituency(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        await service.deleteConstituency(req.params.id);

        return res.json({
            success: true,
            message: "Constituency deleted successfully.",
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unable to delete constituency.";

        const status = message === "Constituency not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message,
        });
    }
}
