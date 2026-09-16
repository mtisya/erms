import { prismaAudit } from "../../config/prisma.audit";

const db = prismaAudit;


/**
 * Get live election results
 */
export async function getLiveResults(
    electionId: string
) {

    // --------------------------------------------------
    // 1. Get election
    // --------------------------------------------------

    const election = await db.election.findUnique({

        where: {
            id: electionId
        }

    });


    if (!election) {

        throw new Error(
            "Election does not exist"
        );

    }


    // --------------------------------------------------
    // 2. Get leaderboard
    // --------------------------------------------------

    const totals = await db.result.groupBy({

        by: [
            "candidateId"
        ],

        where: {
            electionId,
            status: "approved"
        },

        _sum: {
            votes: true
        }

    });


    const candidateIds = totals.map(
        item => item.candidateId
    );


    const candidates = await db.candidate.findMany({

        where: {

            id: {
                in: candidateIds
            },

            electionId

        },

        select: {

            id: true,
            name: true

        }

    });


    const candidateMap = new Map(

        candidates.map(candidate => [

            candidate.id,
            candidate.name

        ])

    );


    const totalVotes = totals.reduce(

        (sum, item) =>
            sum + (item._sum.votes ?? 0),

        0

    );


    const leaderboard = totals

        .map(item => {

            const votes =
                item._sum.votes ?? 0;


            const percentage =
                totalVotes > 0

                    ? Number(
                        (
                            (votes / totalVotes) *
                            100
                        ).toFixed(2)
                    )

                    : 0;


            return {

                candidateId: item.candidateId,

                candidate:
                    candidateMap.get(
                        item.candidateId
                    ) ?? "Unknown",

                votes,

                percentage

            };

        })

        .sort(

            (a, b) =>
                b.votes - a.votes

        )

        .map(

            (item, index) => ({

                rank: index + 1,

                ...item

            })

        );


    // --------------------------------------------------
    // 3. Get polling stations for this election
    // --------------------------------------------------

    const pollingStations =
        await db.pollingStation.count();


    // --------------------------------------------------
    // 4. Get polling stations that have reported
    // --------------------------------------------------

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


    const reportedPollingStations =
        reportedStations.length;


    const pendingPollingStations =
        Math.max(

            0,

            pollingStations -
            reportedPollingStations

        );


    const reportingPercentage =
        pollingStations > 0

            ? Number(

                (
                    (
                        reportedPollingStations /
                        pollingStations
                    ) * 100

                ).toFixed(2)

            )

            : 0;


    // --------------------------------------------------
    // 5. Registered voters
    // --------------------------------------------------

    const voterData =
        await db.pollingStation.aggregate({

            _sum: {

                registeredVoters: true

            }

        });


    const registeredVoters =
        voterData._sum.registeredVoters ?? 0;


    // --------------------------------------------------
    // 6. Turnout
    // --------------------------------------------------

    const turnoutPercentage =
        registeredVoters > 0

            ? Number(

                (
                    (
                        totalVotes /
                        registeredVoters
                    ) * 100

                ).toFixed(2)

            )

            : 0;


    // --------------------------------------------------
    // 7. Current leader
    // --------------------------------------------------

    const leader =
        leaderboard.length > 0

            ? leaderboard[0]

            : null;


    // --------------------------------------------------
    // 8. Return live dashboard data
    // --------------------------------------------------

    return {

        election: {

            id: election.id,

            name: election.name,

            year: election.year,

            description:
                election.description,

            status:
                election.status

        },


        summary: {

            totalVotes,

            registeredVoters,

            turnoutPercentage,

            totalPollingStations:
                pollingStations,

            reportedPollingStations,

            pendingPollingStations,

            reportingPercentage

        },


        leader,


        leaderboard,


        lastUpdated:
            new Date()

    };

}

