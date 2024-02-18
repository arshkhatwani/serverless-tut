import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    let updatedAuction;
    const { id } = event.pathParameters;
    const { amount } = event.body;

    const params = {
        TableName: process.env.AUCTIONS_TABLE_NAME,
        Key: { id },
        UpdateExpression: "set highestBid.amount = :amount",
        ExpressionAttributeValues: {
            ":amount": amount,
        },
        ReturnValues: "ALL_NEW",
    };

    console.log("Placing bid for the auction:", id);
    try {
        const result = await dynamodb.update(params).promise();
        updatedAuction = result.Attributes;
        console.log("Bid placed successfully for the auction:", id);
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError();
    }

    return {
        statusCode: 200,
        body: JSON.stringify(updatedAuction),
    };
}

export const handler = commonMiddleware(placeBid);
