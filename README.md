# poc-serverless-aws-sqs

This project is a Proof of Concept (POC) demonstrating the use of the Serverless Framework with AWS Lambda and SQS. The goal is to experiment with serverless functions, message queues, and related concepts.

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Setup](#setup)

## Introduction

This POC consists of three main serverless functions:
1. **Sender**: Sends messages to the `txQueue`.
2. **Receiver**: Receives messages from the `txQueue` and forwards them to the `pendingTxQueue`.
3. **Scheduler**: Periodically checks `pendingTxQueue` for messages and processes them.

## Architecture

- **Sender**: An HTTP endpoint that receives a payload and sends it to the `txQueue`.
- **Receiver**: An SQS-triggered Lambda function that processes messages from the `txQueue` and sends them to the `pendingTxQueue`.
- **Scheduler**: A scheduled Lambda function that polls the `pendingTxQueue` for messages and processes them.

## Setup

### Prerequisites

- Node.js
- npm or yarn
- Serverless Framework
- AWS account
- Docker (optional for local testing with serverless-offline)

## Setup

### Prerequisites

- Node.js
- npm or yarn
- Serverless Framework
- AWS account
- Docker (optional for local testing with serverless-offline)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/poc-serverless-aws-sqs.git
   cd poc-serverless-aws-sqs

2. Install the dependencies:
npm install OR yarn install    

3. Configure environment variables:
Create a .env file in the root directory with the following content:

IS_OFFLINE=true
AWS_REGION=us-east-1
PENDING_TX_QUEUE_URL=https://sqs.us-east-1.amazonaws.com/your-account-id/pendingTxQueue
