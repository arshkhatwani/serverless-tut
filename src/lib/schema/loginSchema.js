const loginSchema = {
    type: "object",
    required: ["body"],
    properties: {
        body: {
            type: "object",
            required: ["email", "password"],
            properties: {
                email: {
                    type: "string",
                    format: "email",
                },
                password: {
                    type: "string",
                },
            },
        },
    },
};

export default loginSchema;
