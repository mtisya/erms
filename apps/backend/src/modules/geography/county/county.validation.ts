
import { z } from "zod";

export const createCountySchema = z.object({
    name: z.string().trim().min(2),
    code: z.string().trim().min(2),
});

export const updateCountySchema = z.object({
    name: z.string().trim().min(2).optional(),
    code: z.string().trim().min(2).optional(),
}).refine(
    (data) => data.name !== undefined || data.code !== undefined,
    { message: "Provide a county name or code to update." }
);
