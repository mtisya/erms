import { z } from "zod";


export const createUserSchema = z.object({

    firstName: z.string().min(2),

    lastName: z.string().min(2),

    email: z.string().email(),

    password: z.string().min(6),

    roleId: z.string()

});


export const updateUserSchema = z.object({

    firstName: z.string().min(2).optional(),

    lastName: z.string().min(2).optional(),

    email: z.string().email().optional(),

    active: z.boolean().optional(),

    roleId: z.string().optional()

});