import { SQSHandler } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { web3Handler } from "./web3Handler";
import axios from "axios";

const client = new SQSClient({});

const statusChecker: SQSHandler = async (event, context) => {
  const completeTxUrl = process.env.COMPLETE_TRANSACTION_URL;
  const txQueueUrl = "https://sqs.us-east-1.amazonaws.com/445677355183/txQueue.fifo";

  for (const record of event.Records) {
    try {
      const body = JSON.parse(record.body);
      console.log("Processing message body: ", body);

      const txStatus = await web3Handler.getTransactionStatus(body.hash);

      if (txStatus.receipt?.status === 1) {
        // Status 1: Success
        console.log(`Transaction ${body.hash} successful. Notifying API.`);
        // await axios.post(completeTxUrl!, {
        //   ...body,
        //   receipt: txStatus.receipt,
        // });
        // Message is automatically deleted from pendingTxQueue on success
      } else if (txStatus.receipt?.status === 0) {
        // Status 0: Failed
        console.log(`Transaction ${body.hash} failed. Re-queuing to txQueue.`);
        const command = new SendMessageCommand({
          QueueUrl: txQueueUrl,
          MessageBody: JSON.stringify(body),
          MessageGroupId: "group-id", // Ensure this is correct for your logic
          MessageDeduplicationId: Math.random().toString(), // Or use a deterministic ID
        });
        await client.send(command);
        // Message is automatically deleted from pendingTxQueue on success
      } else {
        // Status null: Pending
        console.log(`Transaction ${body.hash} is still pending. It will be retried.`);
        // By throwing an error, we signal to SQS that the message processing failed,
        // and it should be retried after the visibility timeout.
        throw new Error(`Transaction ${body.hash} not confirmed yet.`);
      }
    } catch (error) {
      console.error("Error processing message:", error);
      // Re-throw the error to ensure the message is retried
      throw error;
    }
  }
};

export default statusChecker;
