import { ScheduledHandler } from "aws-lambda";
import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
} from "@aws-sdk/client-sqs";
import { sqs } from "./sqs";
import { isOffline } from "./config";
import { web3Handler } from "./web3Handler";

const scheduler: ScheduledHandler = async (event, context) => {
  const queueUrl = isOffline
    ? "http://localhost:9324/queue/pendingTxQueue.fifo"
    : `https://sqs.${context.invokedFunctionArn.split(":")[3]}.amazonaws.com/${
        context.invokedFunctionArn.split(":")[4]
      }/pendingTxQueue.fifo`;

  try {
    const receiveCommand = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 0,
      WaitTimeSeconds: 0,
    });

    const result = await sqs.send(receiveCommand);

    if (result.Messages) {
      for (const message of result.Messages) {
        console.log("Message Body:", message.Body);

        // Procesar el mensaje aquí
        const txStatus = await web3Handler.getTransactionStatus(message.Body);
        console.log("TX STATUS: ", txStatus);
        // Eliminar el mensaje después de procesarlo
        const deleteCommand = new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle!,
        });

        await sqs.send(deleteCommand);
      }
    }
  } catch (error) {
    console.error("Error receiving or deleting message:", error);
  }
};

export default scheduler;
