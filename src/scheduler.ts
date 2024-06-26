import { ScheduledHandler } from "aws-lambda";
import {
  ReceiveMessageCommand,
  DeleteMessageCommand,
  SQSClient,
} from "@aws-sdk/client-sqs";
import { web3Handler } from "./web3Handler";
import axios from "axios";

const client = new SQSClient({});

const scheduler: ScheduledHandler = async (event, context) => {
  const completeTxUrl = process.env.COMPLETE_TRANSACTION_URL;
  const queueUrl =
    "https://sqs.us-east-1.amazonaws.com/445677355183/pendingTxQueue.fifo";

  try {
    const receiveCommand = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 900,
      WaitTimeSeconds: 0,
    });

    const result = await client.send(receiveCommand);

    if (result.Messages) {
      for (const message of result.Messages) {
        const body = message.Body ? JSON.parse(message.Body) : "";
        console.log("message body: ", body);
        const txStatus = await web3Handler.getTransactionStatus(body.hash);

        if (txStatus.receipt.status === 1) {
          console.log("Delete message and send to api");
          await axios.post(completeTxUrl!, {
            ...body,
            receipt: txStatus,
          });
          const deleteCommand = new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: message.ReceiptHandle!,
          });

          await client.send(deleteCommand);
        }
      }
    }
  } catch (error) {
    console.error("Error receiving or deleting message:", error);
  }
};

export default scheduler;
