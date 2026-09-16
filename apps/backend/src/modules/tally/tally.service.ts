import { prismaAudit } from "../../config/prisma.audit";

const db = prismaAudit;


/**
 * =========================================================
 * POLLING STATION TALLY
 * =========================================================
 */
export async function getPollingStationTally(
    electionId: string,
    pollingStationId: string
) {

    const results = await db.result.findMany({

        where: {
            electionId,
            pollingStationId,
            status: "approved"
        },

        include: {

            candidate: true,

            pollingStation: true

        },

        orderBy: {
            votes: "desc"
        }

    });


    const totalVotes = results.reduce(
        (total, result) =>
            total + result.votes,
        0
    );


    return {

        electionId,

        pollingStationId,

        pollingStation:
            results[0]?.pollingStation ?? null,

        totalVotes,

        candidates: results.map(
            (result) => ({

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

            })
        )

    };

}


/**
 * =========================================================
 * WARD TALLY
 * =========================================================
 */
export async function getWardTally(
    electionId: string,
    wardId: string
) {

    const results = await db.result.findMany({

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


    const totals = new Map<
        string,
        {
            candidateId: string;
            candidate: string;
            votes: number;
        }
    >();


    for (const result of results) {

        const existing =
            totals.get(result.candidateId);


        if (existing) {

            existing.votes +=
                result.votes;

        } else {

            totals.set(
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


    const data =
        Array.from(
            totals.values()
        )
        .sort(
            (a, b) =>
                b.votes - a.votes
        );


    const totalVotes =
        data.reduce(
            (sum, item) =>
                sum + item.votes,
            0
        );


    return {

        electionId,

        wardId,

        totalVotes,

        candidates:
            data.map(
                (item, index) => ({

                    rank:
                        index + 1,

                    candidateId:
                        item.candidateId,

                    candidate:
                        item.candidate,

                    votes:
                        item.votes,

                    percentage:
                        totalVotes > 0
                            ? Number(
                                (
                                    item.votes /
                                    totalVotes *
                                    100
                                ).toFixed(2)
                            )
                            : 0

                })
            )

    };

}


/**
 * =========================================================
 * CONSTITUENCY TALLY
 * =========================================================
 */
export async function getConstituencyTally(
    electionId: string,
    constituencyId: string
) {

    const results = await db.result.findMany({

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

            candidate: true,

            pollingStation: {

                include: {

                    ward: true

                }

            }

        }

    });


    const totals = new Map<
        string,
        {
            candidateId: string;
            candidate: string;
            votes: number;
        }
    >();


    for (const result of results) {

        const existing =
            totals.get(result.candidateId);


        if (existing) {

            existing.votes +=
                result.votes;

        } else {

            totals.set(
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


    const data =
        Array.from(
            totals.values()
        )
        .sort(
            (a, b) =>
                b.votes - a.votes
        );


    const totalVotes =
        data.reduce(
            (sum, item) =>
                sum + item.votes,
            0
        );


    return {

        electionId,

        constituencyId,

        totalVotes,

        candidates:
            data.map(
                (item, index) => ({

                    rank:
                        index + 1,

                    candidateId:
                        item.candidateId,

                    candidate:
                        item.candidate,

                    votes:
                        item.votes,

                    percentage:
                        totalVotes > 0
                            ? Number(
                                (
                                    item.votes /
                                    totalVotes *
                                    100
                                ).toFixed(2)
                            )
                            : 0

                })
            )

    };

}


/**
 * =========================================================
 * COUNTY TALLY
 * =========================================================
 */
export async function getCountyTally(
    electionId: string,
    countyId: string
) {

    const results = await db.result.findMany({

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

            candidate: true,

            pollingStation: {

                include: {

                    ward: {

                        include: {

                            constituency: {

                                include: {
                                    county: true
                                }

                            }

                        }

                    }

                }

            }

        }

    });


    const totals = new Map<
        string,
        {
            candidateId: string;
            candidate: string;
            votes: number;
        }
    >();


    for (const result of results) {

        const existing =
            totals.get(result.candidateId);


        if (existing) {

            existing.votes +=
                result.votes;

        } else {

            totals.set(
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


    const data =
        Array.from(
            totals.values()
        )
        .sort(
            (a, b) =>
                b.votes - a.votes
        );


    const totalVotes =
        data.reduce(
            (sum, item) =>
                sum + item.votes,
            0
        );


    return {

        electionId,

        countyId,

        county:
            results[0]
                ?.pollingStation
                ?.ward
                ?.constituency
                ?.county
                ?.name ?? null,

        totalVotes,

        candidates:
            data.map(
                (item, index) => ({

                    rank:
                        index + 1,

                    candidateId:
                        item.candidateId,

                    candidate:
                        item.candidate,

                    votes:
                        item.votes,

                    percentage:
                        totalVotes > 0
                            ? Number(
                                (
                                    item.votes /
                                    totalVotes *
                                    100
                                ).toFixed(2)
                            )
                            : 0

                })
            )

    };

}


/**
 * =========================================================
 * NATIONAL TALLY
 * =========================================================
 */
export async function getNationalTally(
    electionId: string
) {

    const results = await db.result.findMany({

        where: {

            electionId,

            status: "approved"

        },

        include: {

            candidate: true

        }

    });


    const totals = new Map<
        string,
        {
            candidateId: string;
            candidate: string;
            votes: number;
        }
    >();


    for (const result of results) {

        const existing =
            totals.get(result.candidateId);


        if (existing) {

            existing.votes +=
                result.votes;

        } else {

            totals.set(
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


    const data =
        Array.from(
            totals.values()
        )
        .sort(
            (a, b) =>
                b.votes - a.votes
        );


    const totalVotes =
        data.reduce(
            (sum, item) =>
                sum + item.votes,
            0
        );


    return {

        electionId,

        totalVotes,

        candidates:
            data.map(
                (item, index) => ({

                    rank:
                        index + 1,

                    candidateId:
                        item.candidateId,

                    candidate:
                        item.candidate,

                    votes:
                        item.votes,

                    percentage:
                        totalVotes > 0
                            ? Number(
                                (
                                    item.votes /
                                    totalVotes *
                                    100
                                ).toFixed(2)
                            )
                            : 0

                })
            )

    };

}
