import AWS from "aws-sdk";
import createError from "http-errors";
import validator from "@middy/validator";
import commonMiddleware from "../lib/commonMiddleware";
import getAuctionsSchema from "../lib/schema/getAuctionsSchema";
import { transpileSchema } from "@middy/validator/transpile";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
    const { status } = event.queryStringParameters;
    let auctions;

    console.log("query status:", status);
    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        IndexName: "statusAndEndDate",
        KeyConditionExpression: "#status = :status",
        ExpressionAttributeNames: {
            "#status": "status",
        },
        ExpressionAttributeValues: {
            ":status": status,
        },
    };

    console.log("Retrieving auctions from DB with status:", status);
    try {
        const result = await dynamodb.query(params).promise();
        auctions = result.Items;
        console.log("Retrieved auctions successfully");
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auctions),
    };
}

export const handler = commonMiddleware(getAuctions).use(
    validator({
        eventSchema: transpileSchema(getAuctionsSchema, {
            useDefaults: true,
            strict: false,
        }),
    })
);
