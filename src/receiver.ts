import { SQSHandler } from "aws-lambda";
import {
  SendMessageCommand,
  GetQueueAttributesCommand,
} from "@aws-sdk/client-sqs";
import { sqs } from "./sqs";
import { isOffline } from "./config";
import { web3Handler } from "./web3Handler";

const receiver: SQSHandler = async (event, context) => {
  const region = isOffline
    ? "elasticmq"
    : context.invokedFunctionArn.split(":")[3];
  const accountId = isOffline
    ? "000000000000"
    : context.invokedFunctionArn.split(":")[4];
  const queueName: string = "pendingTxQueue.fifo";

  const pendingTxQueueUrl: string = isOffline
    ? `http://localhost:9324/queue/${queueName}`
    : `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;

  try {
    // // Check the number of messages in pendingTxQueue
    // const queueAttributesCommand = new GetQueueAttributesCommand({
    //   QueueUrl: pendingTxQueueUrl,
    //   AttributeNames: ["ApproximateNumberOfMessages"],
    // });
    // const queueAttributesResponse = await sqs.send(queueAttributesCommand);
    // const pendingMessages =
    //   queueAttributesResponse.Attributes?.ApproximateNumberOfMessages;

    // console.log("Pending messagesss! ", pendingMessages);

    // if (pendingMessages && parseInt(pendingMessages) > 0) {
    //   throw new Error(
    //     "pendingTxQueue is not empty, skipping processing of txQueue messages."
    //   );
    // }

    for (const record of event.Records) {
      const data = JSON.parse(record.body);

      console.log("Message Body ON RECEIVER -->  ", data);

      const balance = await web3Handler.getBalance(data.from);
      console.log(balance);

      const tx = await web3Handler.mint(data.from, "32", 100, "uri");

      const wallet = await web3Handler.createAccount();
      console.log("------------ New wallet ------------");
      console.table(wallet);

      const txHash = await web3Handler.safeTransferFrom(
        data.from,
        data.to,
        data.id,
        data.amount
      );

      console.log("txHash: ", txHash);

      const command = new SendMessageCommand({
        QueueUrl: pendingTxQueueUrl,
        MessageBody: txHash,
        // MessageBody:
        //   "0x0e7be444ac6a1e905626120fa41989294f6f300630af103aa5874af7ade0abb2",
        MessageGroupId: "group-id", // Obligatorio
        MessageDeduplicationId: Math.random().toString(),
      });

      // setTimeout(async () => {
      await sqs.send(command);
      console.log("Message sent to pendingTxQueue");
      // }, 10000);
    }
  } catch (error) {
    console.log("Error sending message to pendingTxQueue:", error);
  }
};

export default receiver;
