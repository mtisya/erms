export interface DashboardSummary {
    totalElections: number;
    totalCandidates: number;
    totalCounties: number;
    totalConstituencies: number;
    totalWards: number;
    totalPollingStations: number;
    totalResults: number;
    totalVotes: number;
}

export interface LeaderboardEntry {
    rank: number;
    candidateId: string;
    candidate: string;
    votes: number;
    percentage: number;
}

export interface ReportingProgress {
    electionId: string;
    totalPollingStations: number;
    reportedPollingStations: number;
    pendingPollingStations: number;
    reportingPercentage: number;
    registeredVoters: number;
    totalVotes: number;
    turnoutPercentage: number;
}


const API_URL =
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api";


async function request<T>(
    endpoint: string
): Promise<T> {

    const token =
        localStorage.getItem("auth_token");


    const response = await fetch(
        `${API_URL}${endpoint}`,
        {
            headers: {
                "Content-Type":
                    "application/json",

                ...(token
                    ? {
                        Authorization:
                            `Bearer ${token}`
                    }
                    : {})
            }
        }
    );


    const result =
        await response.json();


    if (!response.ok || !result.success) {

        throw new Error(
            result.message ||
            "Failed to load dashboard data"
        );

    }


    return result.data;
}


export async function getDashboardSummary() {

    return request<DashboardSummary>(
        "/dashboard/summary"
    );

}


export async function getLeaderboard(
    electionId: string
) {

    return request<LeaderboardEntry[]>(
        `/dashboard/leaderboard/${electionId}`
    );

}


export async function getReportingProgress(
    electionId: string
) {

    return request<ReportingProgress>(
        `/dashboard/progress/${electionId}`
    );

}