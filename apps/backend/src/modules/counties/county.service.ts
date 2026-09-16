import { prismaAudit } from "../../config/prisma.audit";

import {
    CreateCountyInput
} from "./county.types";


export async function createCounty(
    data: CreateCountyInput
) {

    return await prismaAudit.county.create({
        data
    });

}



export async function getCounties() {

    return await prismaAudit.county.findMany({

        include: {
            constituencies: true
        },

        orderBy:{
            name:"asc"
        }

    });

}