// Configuration des endpoints selon l'environnement
// Actuellement seul l'environnement "development" est utilisé

const getEnvironment = (): "development" => {
    return "development"; // Forcé car seuls les endpoints de dev existent
};

export const VITE_GRAPHQL_ENDPOINT = (() => {
    const env = getEnvironment();

    switch (env) {
        case "development":
        default:
            return "/api";
    }
})();
