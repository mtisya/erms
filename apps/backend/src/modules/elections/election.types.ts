
export type ElectionStatus = "draft" | "active" | "completed";

export type ElectionType = "GENERAL" | "BY_ELECTION";

export interface CreateElectionInput {
    name: string;
    year: number;
    description?: string;
    status?: ElectionStatus;
    electionType?: ElectionType;
    byElectionPosition?: string;
}

export interface UpdateElectionInput {
    name?: string;
    year?: number;
    description?: string;
    status?: ElectionStatus;
}
