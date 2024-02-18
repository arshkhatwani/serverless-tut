import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuctions(event, context) {
    let auctions;

    console.log("Retrieving auctions from DB");
    try {
        const result = await dynamodb
            .scan({
                TableName: process.env.AUCTIONS_TABLE_NAME,
            })
            .promise();
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

export const handler = commonMiddleware(getAuctions);
