import { Request, Response } from "express";

import * as service from "./ward.service";


import {
    createWardSchema,
    updateWardSchema,
} from "./ward.validation";

export async function listWards(
    _req: Request,
    res: Response
) {

    const data =
        await service.getWards();


    res.json({

        success: true,

        data

    });

}




export async function getWard(
    req: Request<{ id: string }>,
    res: Response
) {

    const data =
        await service.getWardById(
            req.params.id
        );


    if (!data) {

        return res.status(404).json({

            success: false,

            message: "Ward not found"

        });

    }


    res.json({

        success: true,

        data

    });

}





export async function createWard(
    req: Request,
    res: Response,
) {
    const validation = createWardSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues
                .map((issue) => issue.message)
                .join(", "),
        });
    }

    try {
        const data = await service.createWard(validation.data);

        return res.status(201).json({
            success: true,
            data,
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unable to create ward.";

        return res.status(400).json({
            success: false,
            message,
        });
    }
}
export async function updateWard(
    req: Request<{ id: string }>,
    res: Response,
) {
    const validation = updateWardSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues
                .map((issue) => issue.message)
                .join(", "),
        });
    }

    try {
        const data = await service.updateWard(
            req.params.id,
            validation.data,
        );

        return res.json({
            success: true,
            data,
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unable to update ward.";

        const status = message === "Ward not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message,
        });
    }
}

export async function deleteWard(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        await service.deleteWard(req.params.id);

        return res.json({
            success: true,
            message: "Ward deleted successfully.",
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unable to delete ward.";

        const status = message === "Ward not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message,
        });
    }
}