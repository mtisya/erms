/**
 * Result verification lifecycle
 *
 * pending → verified → approved
 * pending → rejected
 */
export type ResultStatus =
    | "pending"
    | "verified"
    | "approved"
    | "rejected";


/**
 * Verify Result
 */
export interface VerifyResultInput {

    verifiedBy?: string | null;

}


/**
 * Approve Result
 */
export interface ApproveResultInput {

    approvedBy?: string | null;

}


/**
 * Reject Result
 */
export interface RejectResultInput {

    rejectedBy?: string | null;

    reason?: string | null;

}

