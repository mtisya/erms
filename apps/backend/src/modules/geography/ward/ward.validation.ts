import { z } from "zod";


export const createWardSchema = z.object({

    name:z.string().min(2),

    code:z.string().min(2),

    constituencyId:z.string()

});


export const updateWardSchema = z.object({

    name:z.string().min(2).optional(),

    code:z.string().min(2).optional()

});