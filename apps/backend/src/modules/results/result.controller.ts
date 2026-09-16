import { Request, Response } from "express";

import {

    createResult,
    getResults,
    getResultById,
    updateResult,
    deleteResult

} from "./result.service";

function getId(id: string | string[]): string {
    return Array.isArray(id) ? id[0] : id;
}




// CREATE RESULT

export async function create(
    req: Request,
    res: Response
){

    try {

        const result = await createResult(
            req.body
        );


        return res.status(201).json({

            success:true,

            data:result

        });


    } catch(error:any){


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

}




// GET ALL RESULTS

export async function index(
    req:Request,
    res:Response
){

    try {


        const results = await getResults();


        return res.json({

            success:true,

            data:results

        });



    }catch(error:any){


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

}




// GET SINGLE RESULT

export async function show(
    req:Request,
    res:Response
){

    try {


        const result = await getResultById(
            getId(req.params.id)
        );


        return res.json({

            success:true,

            data:result

        });


    }catch(error:any){


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

}




// UPDATE RESULT

export async function update(
    req:Request,
    res:Response
){

    try {


        const result = await updateResult(

            getId(req.params.id),

            req.body

        );


        return res.json({

            success:true,

            data:result

        });



    }catch(error:any){


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

}




// DELETE RESULT

export async function remove(
    req:Request,
    res:Response
){

    try {


        await deleteResult(

            Array.isArray(req.params.id) ? req.params.id[0] : req.params.id

        );


        return res.json({

            success:true,

            message:"Result deleted successfully"

        });



    }catch(error:any){


        return res.status(500).json({

            success:false,

            message:error.message

        });


    }

}