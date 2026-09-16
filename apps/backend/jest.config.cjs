module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",

    roots: ["<rootDir>/src"],

    testMatch: [
        "**/__tests__/**/*.test.ts",
        "**/?(*.)+(spec|test).ts"
    ],

    testPathIgnorePatterns: [
        "/node_modules/",
        "/dist/"
    ],

    moduleFileExtensions: [
        "ts",
        "js",
        "json"
    ],

    clearMocks: true
};