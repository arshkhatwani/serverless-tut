import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import { getAuctionById } from "./getAuction";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function placeBid(event, context) {
    let updatedAuction;
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const auction = await getAuctionById(id);

    if (auction.status === "CLOSED") {
        throw new createError.Forbidden(`You cannot bid on closed auctions`);
    }
    if (amount <= auction.highestBid.amount) {
        throw new createError.Forbidden(
            `Your bid must be higher than ${auction.highestBid.amount}`
        );
    }

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
