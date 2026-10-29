import { Request, Response } from "express";

import * as service from "./polling.service";

import {
    createPollingStationSchema,
    updatePollingStationSchema,
} from "./polling.validation";


export async function listPollingStations(
    _req: Request,
    res: Response
) {

    const data =
        await service.getPollingStations();


    res.json({

        success: true,

        data

    });

}





export async function createPollingStation(
    req: Request,
    res: Response,
) {
    const validation = createPollingStationSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues
                .map((issue) => issue.message)
                .join(", "),
        });
    }

    try {
        const data = await service.createPollingStation(
            validation.data,
        );

        return res.status(201).json({
            success: true,
            data,
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unable to create polling station.";

        return res.status(400).json({
            success: false,
            message,
        });
    }
}

export async function updatePollingStation(
    req: Request<{ id: string }>,
    res: Response,
) {
    const validation = updatePollingStationSchema.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: validation.error.issues
                .map((issue) => issue.message)
                .join(", "),
        });
    }

    try {
        const data = await service.updatePollingStation(
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
                : "Unable to update polling station.";

        const status =
            message === "Polling station not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message,
        });
    }
}

export async function deletePollingStation(
    req: Request<{ id: string }>,
    res: Response,
) {
    try {
        await service.deletePollingStation(req.params.id);

        return res.json({
            success: true,
            message: "Polling station deleted successfully.",
        });
    } catch (error: unknown) {
        const message =
            error instanceof Error
                ? error.message
                : "Unable to delete polling station.";

        const status =
            message === "Polling station not found" ? 404 : 400;

        return res.status(status).json({
            success: false,
            message,
        });
    }
}
