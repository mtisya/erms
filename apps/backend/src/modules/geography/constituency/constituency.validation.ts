import { z } from "zod";


export const createConstituencySchema = z.object({

    name:z.string().min(2),

    code:z.string().min(2),

    countyId:z.string()

});


export const updateConstituencySchema = z.object({

    name:z.string().min(2).optional(),

    code:z.string().min(2).optional()

});