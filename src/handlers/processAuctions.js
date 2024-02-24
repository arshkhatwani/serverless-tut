import { closeAuction } from "../lib/closeAuction";
import { getEndedAuctions } from "../lib/getEndedAuctions";
import createError from "http-errors";

async function processAuctions(event, context) {
    console.log("Processing auctions");
    try {
        const auctionsToClose = await getEndedAuctions();
        console.log("Auctions to close:", auctionsToClose);

        const closePromises = auctionsToClose.map((auction) =>
            closeAuction(auction)
        );
        await Promise.all(closePromises);
        console.log(closePromises.length, "auctions closed successfully");

        return { closed: closePromises.length };
    } catch (error) {
        console.error(error);
        throw new createError.InternalServerError(error);
    }
}

export const handler = processAuctions;
