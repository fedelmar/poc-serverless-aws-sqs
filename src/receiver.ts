import { SQSHandler } from "aws-lambda";
import { web3Handler } from "./web3Handler";
import { SendMessageCommand } from "@aws-sdk/client-sqs";

const receiver: SQSHandler = async (event, context) => {
  try {
    for (const record of event.Records) {
      const data = JSON.parse(record.body);

      console.log("Message Body ON RECEIVER -->  ", data);

      const txHash = await web3Handler.safeTransferFrom(
        data.from,
        data.to,
        data.id,
        data.amount
      );

      console.log("txHash: ", txHash);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

export default receiver;
