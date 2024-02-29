import AWS from "aws-sdk";

const ses = new AWS.SES({ region: "us-east-1" });

async function sendMail(event, context) {
    const record = event["Records"][0];
    console.log("Processing record:", record);

    const mailInfo = JSON.parse(record.body);
    const { subject, body, recipient } = mailInfo;

    console.log("mailInfo:", mailInfo);

    const params = {
        Source: process.env.SOURCE_EMAIL,
        Destination: {
            ToAddresses: [recipient],
        },
        Message: {
            Body: {
                Text: {
                    Data: body,
                },
            },
            Subject: {
                Data: subject,
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
