import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function getAuction(event, context) {
    let auction;
    const { id } = event.pathParameters;

    console.log("Retrieving auction from DB with id:", id);
    try {
        const result = await dynamodb
            .get({
                TableName: process.env.AUCTIONS_TABLE_NAME,
                Key: { id },
            })
            .promise();
        auction = result.Item;
        console.log("Retrieved auction successfully");
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    if (!auction) {
        throw new createError.NotFound(`Auction with id: "${id}" not found`);
    }

    return {
        statusCode: 200,
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(getAuction);
