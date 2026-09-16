import { body } from "express-validator";

export const createElectionValidation = [

    body("name")
        .trim()
        .notEmpty()
        .withMessage("Election name is required"),

    body("year")
        .isInt({
            min: 2000
        })
        .withMessage("Valid election year is required"),

    body("description")
        .optional()
        .isString()

];


export const updateElectionValidation = [

    body("name")
        .optional()
        .trim(),

    body("year")
        .optional()
        .isInt(),

    body("description")
        .optional()
        .isString(),

    body("status")
        .optional()
        .isIn([
            "DRAFT",
            "ACTIVE",
            "COMPLETED"
        ])

];