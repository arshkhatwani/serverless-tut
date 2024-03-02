import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import { transpileSchema } from "@middy/validator/transpile";
import loginSchema from "../lib/schema/loginSchema";
import jwt from "jsonwebtoken";

async function login(event, context) {
    const { email } = event.body;

    console.log("Logging user with email:", email);
    const token = jwt.sign(
        {
            email,
        },
        process.env.TOKEN_SECRET
    );
    console.log("Successfully logged in user with email:", email);

    return {
        statusCode: 200,
        body: JSON.stringify({
            token,
        }),
    };
}

export const handler = commonMiddleware(login).use(
    validator({ eventSchema: transpileSchema(loginSchema) })
);
