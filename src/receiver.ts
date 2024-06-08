import { SQSHandler } from 'aws-lambda';
import { SendMessageCommand } from '@aws-sdk/client-sqs';
import { sqs } from './sqs';
import { isOffline } from './config';

const receiver: SQSHandler = async (event, context) => {
  const region = isOffline ? 'elasticmq' : context.invokedFunctionArn.split(':')[3];
  const accountId = isOffline ? '000000000000' : context.invokedFunctionArn.split(':')[4];
  const queueName: string = 'pendingTxQueue';

  const pendingTxQueueUrl: string = isOffline
    ? `http://localhost:9324/queue/${queueName}`
    : `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;

  try {
    for (const record of event.Records) {
      console.log('Message Body -->  ', record.body);

      const command = new SendMessageCommand({
        QueueUrl: pendingTxQueueUrl,
        MessageBody: record.body,
      });

      await sqs.send(command);
      console.log('Message sent to pendingTxQueue');
    }
  } catch (error) {
    console.log('Error sending message to pendingTxQueue:', error);
  }
};

export default receiver;
