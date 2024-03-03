const createAuctionSchema = {
    type: "object",
    required: ["body", "requestContext"],
    properties: {
        body: {
            type: "object",
            required: ["title"],
            properties: {
                title: {
                    type: "string",
                },
            },
        },
        requestContext: {
            type: "object",
            required: ["authorizer"],
            properties: {
                authorizer: {
                    type: "object",
                    required: ["principalId"],
                    properties: {
                        principalId: {
                            type: "string",
                            format: "email",
                        },
                    },
                },
            },
        },
    },
};

export default createAuctionSchema;
