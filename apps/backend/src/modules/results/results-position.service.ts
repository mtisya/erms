import { prismaAudit } from "../../config/prisma.audit";

const db = prismaAudit as any;


/**
 * RESULTS BY POSITION
 *
 * Returns approved results for a specific election position.
 */
export async function getResultsByPosition(
    electionId: string,
    positionId: string
) {

    const candidates = await db.candidate.findMany({

        where: {
            electionId,
            positionId
        },

        select: {
            id: true,
            name: true
        }

    });


    if (!candidates.length) {

        return [];

    }


    const candidateIds =
        candidates.map(
            (candidate: any) => candidate.id
        );


    const results =
        await db.result.groupBy({

            by: [
                "candidateId"
            ],

            where: {

                electionId,

                candidateId: {
                    in: candidateIds
                },

                status: "approved"

            },

            _sum: {

                votes: true

            }

        });


    const voteMap =
        new Map(

            results.map(
                (result: any) => [

                    result.candidateId,

                    Number(result._sum.votes ?? 0)

                ]
            )

        );


    const totalVotes =
        results.reduce(

            (
                total: number,
                result: any
            ) =>
                total +
                Number(result._sum.votes ?? 0),

            0

        );


    const data =
        candidates

            .map(
                (candidate: any) => {

                    const votes =
                        Number(
                            voteMap.get(
                                candidate.id
                            ) ?? 0
                        );


                    const percentage =
                        totalVotes > 0

                            ? Number(
                                (
                                    votes /
                                    totalVotes *
                                    100
                                ).toFixed(2)
                            )

                            : 0;


                    return {

                        candidateId:
                            candidate.id,

                        candidate:
                            candidate.name,

                        votes,

                        percentage

                    };

                }
            )

            .sort(
                (
                    a: any,
                    b: any
                ) =>
                    b.votes -
                    a.votes
            );


    return data.map(

        (
            candidate: any,
            index: number
        ) => ({

            rank:
                index + 1,

            ...candidate

        })

    );

}