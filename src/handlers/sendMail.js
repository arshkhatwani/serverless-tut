import AWS from "aws-sdk";

const ses = new AWS.SES({ region: "us-east-1" });

async function sendMail(event, context) {
    const params = {
        Source: "",
        Destination: {
            ToAddresses: [""],
        },
        Message: {
            Body: {
                Text: {
                    Data: "Hello from SES",
                },
            },
            Subject: {
                Data: "Test Email from AWS SES",
            },
        },
    };

    try {
        const result = await ses.sendEmail(params).promise();
        console.log(result);
        return result;
    } catch (error) {
        console.error(error);
    }
}

export const handler = sendMail;