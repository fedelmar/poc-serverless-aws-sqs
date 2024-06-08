# poc-serverless-aws-sqs

This project is a Proof of Concept (POC) demonstrating the use of the Serverless Framework with AWS Lambda and SQS. The goal is to experiment with serverless functions, message queues, and related concepts.

## Table of Contents

- [Introduction](#introduction)
- [Architecture](#architecture)
- [Setup](#setup)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Scripts](#scripts)
- [License](#license)

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

