export interface LiveCandidate {

    rank: number;

    candidateId: string;

    candidate: string;

    votes: number;

    percentage: number;

}


export interface LiveElection {

    id: string;

    name: string;

    year: number;

    description: string | null;

    status: string;

}


export interface LiveResultsSummary {

    totalVotes: number;

    registeredVoters: number;

    turnoutPercentage: number;

    totalPollingStations: number;

    reportedPollingStations: number;

    pendingPollingStations: number;

    reportingPercentage: number;

}


export interface LiveResults {

    election: LiveElection;

    summary: LiveResultsSummary;

    leader: LiveCandidate | null;

    leaderboard: LiveCandidate[];

    lastUpdated: string;

}


interface LiveResultsResponse {

    success: boolean;

    data?: LiveResults;

    message?: string;

}


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";
// TEMPORARY DEBUG
console.log(
    "API URL:",
    import.meta.env.VITE_API_URL
);

console.log(
    "Socket URL:",
    import.meta.env.VITE_SOCKET_URL
);

/**
 * Get current approved live election results
 */
export async function getLiveResults(
    electionId: string
): Promise<LiveResults> {

    if (!electionId) {

        throw new Error(
            "Election ID is required"
        );

    }


    const response =
        await fetch(
            `${API_URL}/live-results/${encodeURIComponent(electionId)}`,
            {
                method: "GET",

                headers: {
                    Accept:
                        "application/json"
                }
            }
        );


    let json:
        LiveResultsResponse;


    try {

        json =
            await response.json();

    } catch {

        throw new Error(
            `Live results request failed with HTTP ${response.status}`
        );

    }


    if (!response.ok) {

        throw new Error(
            json.message ||
            `Failed to fetch live results (${response.status})`
        );

    }


    if (!json.success || !json.data) {

        throw new Error(
            json.message ||
            "Live results data is unavailable"
        );

    }


    return json.data;

}
