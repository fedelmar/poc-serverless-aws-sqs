import { APIGatewayProxyHandler } from "aws-lambda";
import { isOffline } from "./config";

import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";

const sender: APIGatewayProxyHandler = async (event, context) => {
  let statusCode: number = 200;
  let message: string;

  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "No body was found",
      }),
    };
  }

  const client = new SQSClient({});

  const queueName: string = "pendingTxQueue";

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
    });

    await client.send(command);

    message = "Message placed in the Queue!";
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
