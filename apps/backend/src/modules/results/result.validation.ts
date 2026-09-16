import { body } from "express-validator";


export const createResultValidation = [

    body("electionId")
        .notEmpty()
        .withMessage("Election is required"),

    body("candidateId")
        .notEmpty()
        .withMessage("Candidate is required"),


    body("pollingStationId")
        .notEmpty()
        .withMessage("Polling station is required"),


    body("votes")
        .isInt({min:0})
        .withMessage("Votes must be a valid number")

];



export const updateResultValidation = [

    body("votes")
        .isInt({min:0})
        .withMessage("Votes must be a valid number")

];