import { ScheduledHandler } from 'aws-lambda';
import { ReceiveMessageCommand, DeleteMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from './sqs';
import { isOffline } from './config';

const scheduler: ScheduledHandler = async (event, context) => {
  const queueUrl = isOffline 
    ? 'http://localhost:9324/queue/pendingTxQueue'
    : `https://sqs.${context.invokedFunctionArn.split(':')[3]}.amazonaws.com/${context.invokedFunctionArn.split(':')[4]}/pendingTxQueue`;

  try {
    const receiveCommand = new ReceiveMessageCommand({
      QueueUrl: queueUrl,
      MaxNumberOfMessages: 1,
      VisibilityTimeout: 20,
      WaitTimeSeconds: 0,
    });

    const result = await sqs.send(receiveCommand);
    
    console.log('----------- Result ---------------')
    console.log(result)
    if (result.Messages) {
      for (const message of result.Messages) {
        console.log('Message Body:', message.Body);

        // Procesar el mensaje aquí

        // Eliminar el mensaje después de procesarlo
        const deleteCommand = new DeleteMessageCommand({
          QueueUrl: queueUrl,
          ReceiptHandle: message.ReceiptHandle!,
        });

        await sqs.send(deleteCommand);
      }
    }
  } catch (error) {
    console.error('Error receiving or deleting message:', error);
  }
};

export default scheduler;
