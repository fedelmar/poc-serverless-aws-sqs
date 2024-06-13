import { APIGatewayProxyHandler } from "aws-lambda";
import { isOffline } from "./config";

import { SQSClient, SendMessageCommand, SendMessageCommandOutput } from "@aws-sdk/client-sqs";

const sender: APIGatewayProxyHandler = async (event, context) => {
  let statusCode: number = 200;
  let message: SendMessageCommandOutput;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  const client = new SQSClient({});
  const queueUrl: string = "https://sqs.us-east-1.amazonaws.com/445677355183/txQueue.fifo";

  try {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: event.body,
      MessageAttributes: {
        AttributeNameHere: {
          StringValue: "Attribute Value Here",
          DataType: "String",
        },
      },
      MessageGroupId: 'group-id',
      MessageDeduplicationId: Math.random().toString(),
    });

    const response = await client.send(command);

    console.log(response)
    message = response;
  } catch (error) {
    console.log("Error:", error);
    message = error.message;
    statusCode = 500;
  }

  return {
    statusCode,
    body: JSON.stringify({
      message,
    }),
  };
};

export default sender;
