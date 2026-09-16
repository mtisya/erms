import { Request, Response } from "express";

import * as auditService from "./audit.service";



export async function listAuditLogs(
    _req:Request,
    res:Response
){

    const logs =
        await auditService.getAuditLogs();


    res.json({

        success:true,

        data:logs

    });

}