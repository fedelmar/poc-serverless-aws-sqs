import { APIGatewayProxyHandler } from "aws-lambda";
import { isOffline } from "./config";
import { sqs } from "./sqs";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

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

  const region = isOffline
    ? "elasticmq"
    : context.invokedFunctionArn.split(":")[3];
  const accountId = isOffline
    ? "000000000000"
    : context.invokedFunctionArn.split(":")[4];
  // const queueName: string = "pendingTxQueue.fifo";
  const queueName: string = "txQueue.fifo";

  const queueUrl: string = isOffline
    ? `http://localhost:9324/queue/${queueName}`
    : `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;

  try {
    const command = new SendMessageCommand({
      QueueUrl: queueUrl,
      MessageBody: event.body,
      MessageGroupId: "group-id", // Obligatorio
      MessageDeduplicationId: Math.random().toString(),
    });

    await sqs.send(command);

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
