import {  GetQueueAttributesCommand } from "@aws-sdk/client-sqs";
import { sqs } from "./sqs";



const checkPendingMessages = async (): Promise<boolean> => {
  const queueUrl = "YOUR_QUEUE_URL_HERE"; // Reemplaza con la URL de tu cola pendingTxQueue
  try {
    const { Attributes } = await sqs.send(
      new GetQueueAttributesCommand({
        QueueUrl: queueUrl,
        AttributeNames: ["ApproximateNumberOfMessages"],
      })
    );

    if (Attributes?.ApproximateNumberOfMessages) {
      const pendingMessages = parseInt(
        Attributes.ApproximateNumberOfMessages
      );
      return pendingMessages > 0;
    }

    return false;
  } catch (error) {
    console.error("Error al obtener atributos de la cola:", error);
    return false;
  }
};

export default checkPendingMessages;