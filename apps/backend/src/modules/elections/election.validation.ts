
import { body } from "express-validator";

export const createElectionValidation = [
    body("name")
        .trim()
        .notEmpty()
        .withMessage("Election name is required"),

    body("year")
        .isInt({ min: 2000 })
        .withMessage("Valid election year is required"),

    body("description")
        .optional()
        .isString(),

    body("status")
        .optional()
        .isIn(["draft", "active", "completed"])
        .withMessage("Status must be draft, active, or completed"),
    body("electionType")
        .optional()
        .isIn(["GENERAL", "BY_ELECTION"])
        .withMessage("Election type must be GENERAL or BY_ELECTION"),

    body("byElectionPosition")
        .if((_, { req }) => req.body.electionType === "BY_ELECTION")
        .isIn([
            "President",
            "Governor",
            "Senator",
            "Woman Representative",
            "Member of National Assembly (MP)",
            "Member of County Assembly (MCA)",
        ])
        .withMessage("Select a valid position for the by-election"),
];

export const updateElectionValidation = [
    body("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Election name cannot be empty"),

    body("year")
        .optional()
        .isInt({ min: 2000 })
        .withMessage("Valid election year is required"),

    body("description")
        .optional()
        .isString(),

    body("status")
        .optional()
        .isIn(["draft", "active", "completed"])
        .withMessage("Status must be draft, active, or completed"),
    body("electionType")
        .optional()
        .isIn(["GENERAL", "BY_ELECTION"])
        .withMessage("Election type must be GENERAL or BY_ELECTION"),
    body("byElectionPosition")
        .if((_, { req }) => req.body.electionType === "BY_ELECTION")
        .isIn([
            "President",
            "Governor",
            "Senator",
            "Woman Representative",
            "Member of National Assembly (MP)",
            "Member of County Assembly (MCA)",
        ])
        .withMessage("Select a valid position for the by-election"),
];
