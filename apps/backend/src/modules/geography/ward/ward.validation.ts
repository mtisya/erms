
import { z } from "zod";

export const createWardSchema = z.object({
    name: z.string().trim().min(2),
    code: z.string().trim().min(2),
    constituencyId: z.string().trim().min(1),
});

export const updateWardSchema = z
    .object({
        name: z.string().trim().min(2).optional(),
        code: z.string().trim().min(2).optional(),
    })
    .refine(
        (data) =>
            data.name !== undefined ||
            data.code !== undefined,
        {
            message: "Provide a ward name or code to update.",
        },
    );
