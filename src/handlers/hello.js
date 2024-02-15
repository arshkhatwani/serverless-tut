async function hello(event, context) {
    return {
        statusCode: 200,
        body: JSON.stringify({ message: "Hello from JS!!!" }),
    };
}

export const handler = hello;
