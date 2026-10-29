
import { z } from "zod";

export const createPollingStationSchema = z.object({
    name: z.string().trim().min(2),
    code: z.string().trim().min(2),
    registeredVoters: z.number().int().positive(),
    wardId: z.string().trim().min(1),
});

export const updatePollingStationSchema = z
    .object({
        name: z.string().trim().min(2).optional(),
        code: z.string().trim().min(2).optional(),
        registeredVoters: z.number().int().positive().optional(),
    })
    .refine(
        (data) =>
            data.name !== undefined ||
            data.code !== undefined ||
            data.registeredVoters !== undefined,
        {
            message: "Provide at least one polling station field to update.",
        },
    );
