import { body } from "express-validator";


export const createPollingStationValidation = [

    body("name")
        .notEmpty()
        .withMessage("Polling station name is required"),


    body("code")
        .notEmpty()
        .withMessage("Polling station code is required"),


    body("registeredVoters")
        .isInt({ min: 0 })
        .withMessage("Registered voters must be a valid number"),


    body("wardId")
        .notEmpty()
        .withMessage("Ward ID is required")

];



export const updatePollingStationValidation = [

    body("name")
        .optional()
        .notEmpty(),


    body("code")
        .optional()
        .notEmpty(),


    body("registeredVoters")
        .optional()
        .isInt({ min: 0 }),


    body("wardId")
        .optional()
        .notEmpty()

];