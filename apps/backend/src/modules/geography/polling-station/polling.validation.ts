import { z } from "zod";


export const createPollingStationSchema = z.object({

    name:z.string().min(2),

    code:z.string().min(2),

    registeredVoters:z.number().positive(),

    wardId:z.string()

});


export const updatePollingStationSchema = z.object({

    name:z.string().min(2).optional(),

    code:z.string().min(2).optional(),

    registeredVoters:z.number().positive().optional()

});