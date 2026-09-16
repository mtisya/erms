export interface CreatePollingStationInput {

    name:string;

    code:string;

    registeredVoters:number;

    wardId:string;

}


export interface UpdatePollingStationInput {

    name?:string;

    code?:string;

    registeredVoters?:number;

}