import AWS from "aws-sdk";

const sqs = new AWS.SQS();
const QUEUE_URL = process.env.MAIL_QUEUE_URL;

async function sendMessageToMailQueue(messageBody) {
    console.log("Sending message to mail queue");
    try {
        if (!QUEUE_URL) {
            throw new Error("QueueUrl not specified");
        }

        await sqs
            .sendMessage({
                DelaySeconds: 2,
                QueueUrl: QUEUE_URL,
                MessageBody: JSON.stringify(messageBody),
            })
            .promise();
        console.log("Sent message to mail queue successfully");
    } catch (error) {
        console.error("Could not send message to queue due to error:", error);
    }
}

export default sendMessageToMailQueue;
