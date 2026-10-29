
import { prismaAudit } from "../../config/prisma.audit";

import {
    CreateElectionInput,
    UpdateElectionInput,
} from "./election.types";

const db = prismaAudit as any;

const GENERAL_ELECTION_POSITIONS = [
    { name: "President", scope: "NATIONAL" },
    { name: "Governor", scope: "COUNTY" },
    { name: "Senator", scope: "COUNTY" },
    { name: "Woman Representative", scope: "COUNTY" },
    {
        name: "Member of National Assembly (MP)",
        scope: "CONSTITUENCY",
    },
    {
        name: "Member of County Assembly (MCA)",
        scope: "WARD",
    },
] as const;

const BY_ELECTION_POSITIONS: Record<
    string,
    { name: string; scope: "NATIONAL" | "COUNTY" | "CONSTITUENCY" | "WARD" }
> = Object.fromEntries(
    GENERAL_ELECTION_POSITIONS.map((position) => [
        position.name,
        position,
    ]),
);

export async function createElection(data: CreateElectionInput) {
    const {
        electionType = "GENERAL",
        byElectionPosition,
        ...electionData
    } = data;

    if (
        electionType === "BY_ELECTION" &&
        (!byElectionPosition ||
            !BY_ELECTION_POSITIONS[byElectionPosition])
    ) {
        throw new Error("Select a valid position for the by-election.");
    }

    return db.$transaction(async (tx: any) => {
        const election = await tx.election.create({
            data: {
                ...electionData,
                electionType,
            },
        });

        const positions =
            electionType === "GENERAL"
                ? GENERAL_ELECTION_POSITIONS
                : [BY_ELECTION_POSITIONS[byElectionPosition!]];

        await tx.electionPosition.createMany({
            data: positions.map((position) => ({
                electionId: election.id,
                name: position.name,
                scope: position.scope,
            })),
        });

        return tx.election.findUnique({
            where: { id: election.id },
            include: {
                positions: true,
                candidates: true,
            },
        });
    });
}

export async function getElections() {
    return db.election.findMany({
        include: {
            positions: true,
            candidates: true,
        },
        orderBy: {
            year: "desc",
        },
    });
}

export async function getElectionById(id: string) {
    return db.election.findUnique({
        where: { id },
        include: {
            positions: true,
            candidates: true,
            results: true,
        },
    });
}

export async function updateElection(
    id: string,
    data: UpdateElectionInput,
) {
    return db.election.update({
        where: { id },
        data,
    });
}

export async function deleteElection(id: string) {
    const election = await db.election.findUnique({
        where: { id },
        select: {
            id: true,
            _count: {
                select: {
                    results: true,
                },
            },
        },
    });

    if (!election) {
        return { deleted: false, reason: "not_found" as const };
    }

    if (election._count.results > 0) {
        return { deleted: false, reason: "has_results" as const };
    }

    await db.election.delete({
        where: { id },
    });

    return { deleted: true as const };
}
