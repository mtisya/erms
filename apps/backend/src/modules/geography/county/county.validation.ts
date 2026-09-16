import { z } from "zod";


export const createCountySchema = z.object({

    name:z.string().min(2),

    code:z.string().min(2)

});


export const updateCountySchema = z.object({

    name:z.string().min(2).optional(),

    code:z.string().min(2).optional()

});