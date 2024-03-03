const jwt = require("jsonwebtoken");

async function verifyToken(event, context, callback) {
    const authorizationToken = event.authorizationToken;

    const token = authorizationToken.split(" ")[1];

    if (!token) callback(null, "Unauthorized");

    try {
        const decoded = jwt.verify(token, process.env.TOKEN_SECRET);

        if (!decoded.email) callback(null, "Unauthorized");

        const principalId = decoded.email;
        callback(null, generatePolicy(principalId, "Allow", event.methodArn));
    } catch (error) {
        console.error("Error when verifying token:", error);
        callback(null, "Unauthorized");
    }
}

// Helper function to generate IAM Policy
function generatePolicy(principalId, effect, resource) {
    const authResponse = {};
    authResponse.principalId = principalId;
    if (effect && resource) {
        const policyDocument = {};
        policyDocument.Version = "2012-10-17";
        policyDocument.Statement = [];
        const statementOne = {};
        statementOne.Action = "execute-api:Invoke";
        statementOne.Effect = effect;
        statementOne.Resource = resource;
        policyDocument.Statement[0] = statementOne;
        authResponse.policyDocument = policyDocument;
    }
    return authResponse;
}

export const handler = verifyToken;
