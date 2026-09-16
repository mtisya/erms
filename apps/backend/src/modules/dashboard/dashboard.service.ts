import { prismaAudit } from "../../config/prisma.audit";

const db = prismaAudit;

export async function getDashboardSummary() {

    const [
        totalElections,
        totalCandidates,
        totalCounties,
        totalConstituencies,
        totalWards,
        totalPollingStations,
        totalResults
    ] = await Promise.all([

        db.election.count(),

        db.candidate.count(),

        db.county.count(),

        db.constituency.count(),

        db.ward.count(),

        db.pollingStation.count(),

        db.result.count()

    ]);

    const votes = await db.result.aggregate({

        _sum: {
            votes: true
        }

    });

    return {

        totalElections,

        totalCandidates,

        totalCounties,

        totalConstituencies,

        totalWards,

        totalPollingStations,

        totalResults,

        totalVotes: votes._sum.votes ?? 0

    };

}

export async function getLeaderboard(
    electionId: string
) {

    const results = await db.result.findMany({

        where: {
            electionId
        },

        select: {

            candidateId: true,

            votes: true,

            candidate: {
                select: {
                    id: true,
                    name: true
                }
            }

        }

    });


    /*
    |--------------------------------------------------------------------------
    | Aggregate votes by candidate
    |--------------------------------------------------------------------------
    */

    const candidateTotals = new Map<
        string,
        {
            candidateId: string;
            candidate: string;
            votes: number;
        }
    >();


    for (const result of results) {

        const existing =
            candidateTotals.get(
                result.candidateId
            );


        if (existing) {

            existing.votes += result.votes;

        } else {

            candidateTotals.set(

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


    /*
    |--------------------------------------------------------------------------
    | Convert Map to Array
    |--------------------------------------------------------------------------
    */

    const leaderboard =
        Array.from(
            candidateTotals.values()
        );


    /*
    |--------------------------------------------------------------------------
    | Calculate total votes
    |--------------------------------------------------------------------------
    */

    const totalVotes =
        leaderboard.reduce(

            (sum, candidate) =>
                sum + candidate.votes,

            0

        );


    /*
    |--------------------------------------------------------------------------
    | Sort candidates by votes
    |--------------------------------------------------------------------------
    */

    leaderboard.sort(

        (a, b) =>
            b.votes - a.votes

    );


    /*
    |--------------------------------------------------------------------------
    | Add rank and percentage
    |--------------------------------------------------------------------------
    */

    return leaderboard.map(

        (candidate, index) => ({

            rank: index + 1,

            candidateId:
                candidate.candidateId,

            candidate:
                candidate.candidate,

            votes:
                candidate.votes,

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

        })

    );

}

export async function getReportingProgress(
    electionId: string
) {

    /*
    |--------------------------------------------------------------------------
    | Get all polling stations
    |--------------------------------------------------------------------------
    */

    const pollingStations =
        await db.pollingStation.findMany({

            select: {

                id: true,

                registeredVoters: true

            }

        });


    /*
    |--------------------------------------------------------------------------
    | Get polling stations that have submitted results
    |--------------------------------------------------------------------------
    */

    const reportedStations =
        await db.result.findMany({

            where: {

                electionId

            },

            select: {

                pollingStationId: true

            },

            distinct: [

                "pollingStationId"

            ]

        });


    /*
    |--------------------------------------------------------------------------
    | Calculate station totals
    |--------------------------------------------------------------------------
    */

    const totalPollingStations =
        pollingStations.length;


    const reportedPollingStations =
        reportedStations.length;


    const pendingPollingStations =
        Math.max(

            0,

            totalPollingStations -
            reportedPollingStations

        );


    /*
    |--------------------------------------------------------------------------
    | Reporting percentage
    |--------------------------------------------------------------------------
    */

    const reportingPercentage =
        totalPollingStations > 0

            ? Number(

                (
                    reportedPollingStations /
                    totalPollingStations *
                    100

                ).toFixed(2)

            )

            : 0;


    /*
    |--------------------------------------------------------------------------
    | Registered voters
    |--------------------------------------------------------------------------
    */

    const registeredVoters =
        pollingStations.reduce(

            (total, station) =>
                total +
                station.registeredVoters,

            0

        );


    /*
    |--------------------------------------------------------------------------
    | Total votes
    |--------------------------------------------------------------------------
    */

    const voteResult =
        await db.result.aggregate({

            where: {

                electionId

            },

            _sum: {

                votes: true

            }

        });


    const totalVotes =
        voteResult._sum.votes ?? 0;


    /*
    |--------------------------------------------------------------------------
    | Turnout percentage
    |--------------------------------------------------------------------------
    */

    const turnoutPercentage =
        registeredVoters > 0

            ? Number(

                (
                    totalVotes /
                    registeredVoters *
                    100

                ).toFixed(2)

            )

            : 0;


    /*
    |--------------------------------------------------------------------------
    | Return dashboard data
    |--------------------------------------------------------------------------
    */

    return {

        electionId,

        totalPollingStations,

        reportedPollingStations,

        pendingPollingStations,

        reportingPercentage,

        registeredVoters,

        totalVotes,

        turnoutPercentage

    };

}


