import { SQSHandler } from "aws-lambda";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { Web3Service } from "./services/web3Service";

const client = new SQSClient({});

const senderToBlockchain: SQSHandler = async (event, context) => {
  const pendingTxQueueUrl =
    "https://sqs.us-east-1.amazonaws.com/445677355183/pendingTxQueue.fifo";
  const web3Service = new Web3Service();
  try {
    for (const record of event.Records) {
      let body = JSON.parse(record.body);

      console.log("Message Body ON RECEIVER -->  ", body);

      if (body.type === "safeTransfer") {
        const { data } = body;
        const { hash } = await web3Service.safeTransfer(
          data.from,
          data.to,
          data.id,
          data.amount
        );

        body.hash = hash;
        const command = new SendMessageCommand({
          QueueUrl: pendingTxQueueUrl,
          MessageBody: JSON.stringify(body),
          MessageGroupId: "group-id",
          MessageDeduplicationId: Math.random().toString(),
        });

        await client.send(command);
        console.log("Message sent to pendingTxQueue");
      }
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

export default senderToBlockchain;
