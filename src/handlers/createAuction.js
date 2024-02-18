import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
    console.log("Event body:", event.body);
    const { title } = event.body;

    const auction = {
        id: uuid(),
        title,
        status: "OPEN",
        createdAt: new Date().toISOString(),
    };

    console.log("Creating Auction:", auction);
    try {
        await dynamodb
            .put({
                TableName: process.env.AUCTIONS_TABLE_NAME,
                Item: auction,
            })
            .promise();
        console.log("Successfully created auction:", auction);
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }

    return {
        statusCode: 201,
        body: JSON.stringify(auction),
    };
}

export const handler = commonMiddleware(createAuction);
