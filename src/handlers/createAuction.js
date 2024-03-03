import { v4 as uuid } from "uuid";
import AWS from "aws-sdk";
import createError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
import validator from "@middy/validator";
import { transpileSchema } from "@middy/validator/transpile";
import createAuctionSchema from "../lib/schema/createAuctionSchema";

const dynamodb = new AWS.DynamoDB.DocumentClient();

async function createAuction(event, context) {
    console.log("Event body:", event.body);
    const { title } = event.body;
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);

    const userEmail = event.requestContext.authorizer.principalId;

    const auction = {
        id: uuid(),
        title,
        status: "OPEN",
        createdAt: now.toISOString(),
        endingAt: endDate.toISOString(),
        highestBid: {
            amount: 0,
        },
        user: userEmail,
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

export const handler = commonMiddleware(createAuction).use(
    validator({ eventSchema: transpileSchema(createAuctionSchema) })
);
