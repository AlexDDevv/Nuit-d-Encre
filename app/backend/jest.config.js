/** @type {import('jest').Config} */
module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/*.test.ts"],
    clearMocks: true,
    // ts-jest type-checke chaque fichier dans son worker : au-delà de quelques
    // workers, la mémoire sature (workers tués par SIGKILL sous WSL).
    maxWorkers: "25%",
};
