
import { z } from "zod";

export const createConstituencySchema = z.object({
    name: z.string().trim().min(2),
    code: z.string().trim().min(2),
    countyId: z.string().trim().min(1),
});

export const updateConstituencySchema = z.object({
    name: z.string().trim().min(2).optional(),
    code: z.string().trim().min(2).optional(),
}).refine(
    (data) => data.name !== undefined || data.code !== undefined,
    {
        message: "Provide a constituency name or code to update.",
    },
);
