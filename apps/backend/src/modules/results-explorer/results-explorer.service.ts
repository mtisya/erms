import { prismaAudit } from "../../config/prisma.audit";

const db = prismaAudit;


/**
 * POLLING STATION RESULTS
 *
 * Approved results only.
 */
export async function getPollingStationResults(
    electionId: string,
    pollingStationId: string
) {

    const station =
        await db.pollingStation.findUnique({

            where: {
                id: pollingStationId
            },

            include: {
                ward: true
            }

        });


    if (!station) {
        throw new Error(
            "Polling station not found"
        );
    }


    const results =
        await db.result.findMany({

            where: {

                electionId,

                pollingStationId,

                status: "approved"

            },

            include: {

                candidate: true

            }

        });


    const totalVotes =
        results.reduce(
            (total, result) =>
                total + result.votes,
            0
        );


    const candidates =
        results
            .map(result => ({

                candidateId:
                    result.candidateId,

                candidate:
                    result.candidate.name,

                votes:
                    result.votes,

                percentage:
                    totalVotes > 0
                        ? Number(
                            (
                                result.votes /
                                totalVotes *
                                100
                            ).toFixed(2)
                        )
                        : 0

            }))
            .sort(
                (a, b) =>
                    b.votes - a.votes
            );


    return {

        electionId,

        pollingStationId,

        pollingStation: station,

        totalVotes,

        candidates

    };

}


/**
 * WARD RESULTS
 */
export async function getWardResults(
    electionId: string,
    wardId: string
) {

    const ward =
        await db.ward.findUnique({

            where: {
                id: wardId
            },

            include: {
                constituency: true
            }

        });


    if (!ward) {
        throw new Error(
            "Ward not found"
        );
    }


    const results =
        await db.result.findMany({

            where: {

                electionId,

                status: "approved",

                pollingStation: {
                    wardId
                }

            },

            include: {

                candidate: true,

                pollingStation: true

            }

        });


    return aggregateResults(
        results,
        {
            id: ward.id,
            name: ward.name
        }
    );

}


/**
 * CONSTITUENCY RESULTS
 */
export async function getConstituencyResults(
    electionId: string,
    constituencyId: string
) {

    const constituency =
        await db.constituency.findUnique({

            where: {
                id: constituencyId
            },

            include: {
                county: true
            }

        });


    if (!constituency) {
        throw new Error(
            "Constituency not found"
        );
    }


    const results =
        await db.result.findMany({

            where: {

                electionId,

                status: "approved",

                pollingStation: {

                    ward: {

                        constituencyId

                    }

                }

            },

            include: {

                candidate: true

            }

        });


    return aggregateResults(
        results,
        {
            id: constituency.id,
            name: constituency.name
        }
    );

}


/**
 * COUNTY RESULTS
 */
export async function getCountyResults(
    electionId: string,
    countyId: string
) {

    const county =
        await db.county.findUnique({

            where: {
                id: countyId
            }

        });


    if (!county) {
        throw new Error(
            "County not found"
        );
    }


    const results =
        await db.result.findMany({

            where: {

                electionId,

                status: "approved",

                pollingStation: {

                    ward: {

                        constituency: {

                            countyId

                        }

                    }

                }

            },

            include: {

                candidate: true

            }

        });


    return aggregateResults(
        results,
        {
            id: county.id,
            name: county.name
        }
    );

}


/**
 * NATIONAL RESULTS
 */
export async function getNationalResults(
    electionId: string
) {

    const election =
        await db.election.findUnique({

            where: {
                id: electionId
            }

        });


    if (!election) {
        throw new Error(
            "Election not found"
        );
    }


    const results =
        await db.result.findMany({

            where: {

                electionId,

                status: "approved"

            },

            include: {

                candidate: true

            }

        });


    return aggregateResults(
        results,
        null
    );

}


/**
 * COMMON AGGREGATION
 */
function aggregateResults(
    results: any[],
    location: {
        id: string;
        name: string;
    } | null
) {

    const candidateMap =
        new Map<
            string,
            {
                candidateId: string;
                candidate: string;
                votes: number;
            }
        >();


    for (const result of results) {

        const existing =
            candidateMap.get(
                result.candidateId
            );


        if (existing) {

            existing.votes +=
                result.votes;

        } else {

            candidateMap.set(

                result.candidateId,

                {

                    candidateId:
                        result.candidateId,

                    candidate:
                        result.candidate.name,

                    votes:
                        result.votes

                }

            );

        }

    }


    const totalVotes =
        Array.from(
            candidateMap.values()
        ).reduce(

            (total, candidate) =>
                total + candidate.votes,

            0

        );


    const candidates =
        Array.from(
            candidateMap.values()
        )

            .map(candidate => ({

                ...candidate,

                percentage:
                    totalVotes > 0
                        ? Number(
                            (
                                candidate.votes /
                                totalVotes *
                                100
                            ).toFixed(2)
                        )
                        : 0

            }))

            .sort(
                (a, b) =>
                    b.votes - a.votes
            )

            .map(
                (candidate, index) => ({

                    rank: index + 1,

                    ...candidate

                })
            );


    return {

        location,

        totalVotes,

        candidates

    };

}