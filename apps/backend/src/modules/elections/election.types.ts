export interface CreateElectionInput {
    name: string;
    year: number;
    description?: string;
}

export interface UpdateElectionInput {
    name?: string;
    year?: number;
    description?: string;
    status?: "DRAFT" | "ACTIVE" | "COMPLETED";
}