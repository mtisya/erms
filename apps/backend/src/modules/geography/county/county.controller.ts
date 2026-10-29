import { Request, Response } from "express";

import * as countyService from "./county.service";

import {
    createCountySchema,
    updateCountySchema,
} from "./county.validation";

export async function listCounties(
    _req: Request,
    res: Response
) {

    const counties =
        await countyService.getCounties();


    res.json({

        success: true,

        data: counties

    });

}




export async function getCounty(
    req: Request<{ id: string }>,
    res: Response
) {

    const county =
        await countyService.getCountyById(
            req.params.id
        );


    if (!county) {

        return res.status(404).json({

            success: false,

            message: "County not found"

        });

    }



    res.json({

        success: true,

        data: county

    });

}

export async function createCounty(
    req: Request,
    res: Response
) {
    const validation = createCountySchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues
                .map((issue) => issue.message)
                .join(", "),
        });
    }

    try {
        const county = await countyService.createCounty(
            validation.data
        );

        return res.status(201).json({
            success: true,
            data: county,
        });
    } catch (error: unknown) {
        return res.status(400).json({
            success: false,
            message: error instanceof Error
                ? error.message
                : "Unable to create county",
        });
    }
}

export async function updateCounty(
    req: Request<{ id: string }>,
    res: Response
) {
    const validation = updateCountySchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues
                .map((issue) => issue.message)
                .join(", "),
        });
    }

    try {
        const county = await countyService.updateCounty(
            req.params.id,
            validation.data
        );

        return res.json({
            success: true,
            data: county,
        });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "Unable to update county";

        const status = message === "County not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message,
        });
    }
}
export async function deleteCounty(
    req: Request<{ id: string }>,
    res: Response
) {
    try {
        await countyService.deleteCounty(req.params.id);

        return res.json({
            success: true,
            message: "County deleted successfully",
        });
    } catch (error: unknown) {
        const message = error instanceof Error
            ? error.message
            : "Unable to delete county";

        const status = message === "County not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message,
        });
    }
}