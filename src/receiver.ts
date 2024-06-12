import { SQSHandler } from "aws-lambda";

const receiver: SQSHandler = async (event, context) => {
  try {
    for (const record of event.Records) {
      console.log("Message Body -->  ", record.body);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

export default receiver;
