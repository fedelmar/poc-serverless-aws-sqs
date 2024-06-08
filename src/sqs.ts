import { SQSClient } from '@aws-sdk/client-sqs';

const isOffline = process.env.IS_OFFLINE;

export const sqs = new SQSClient({
  region: isOffline ? 'elasticmq' : process.env.AWS_REGION,
  endpoint: isOffline ? 'http://localhost:9324' : undefined,
  credentials: isOffline
    ? { accessKeyId: 'root', secretAccessKey: 'root' }
    : undefined,
});
