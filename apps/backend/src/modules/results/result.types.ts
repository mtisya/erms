export interface CreateResultInput {

    electionId:string;

    candidateId:string;

    pollingStationId:string;

    votes:number;

}


export interface UpdateResultInput {

    votes?:number;

}