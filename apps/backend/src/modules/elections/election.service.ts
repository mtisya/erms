import { prismaAudit } from "../../config/prisma.audit";

import {
    CreateElectionInput,
    UpdateElectionInput
} from "./election.types";

const db = prismaAudit as any;


export async function createElection(
    data: CreateElectionInput
) {

    return db.election.create({
        data
    });

}


export async function getElections() {

    return db.election.findMany({

        include: {

            positions: true,

            candidates: true

        },

        orderBy: {

            year: "desc"

        }

    });

}


export async function getElectionById(
    id: string
) {

    return  db.election.findUnique({

        where: {

            id

        },

        include: {

            positions: true,

            candidates: true,

            results: true

        }

    });

}


export async function updateElection(
    id: string,
    data: UpdateElectionInput
) {

    return db.election.update({

        where: {

            id

        },

        data

    });

}


export async function deleteElection(
    id: string
) {

    return db.election.delete({

        where: {

            id

        }

    });

}