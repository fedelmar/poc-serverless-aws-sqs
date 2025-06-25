import { Web3Handler } from "@q-hausse/web3-handler";

export const web3Handler = new Web3Handler(
  process.env.CONTRACT_PROXY as string,
  process.env.WEB3_INFURA_PROVIDER_URL as string
);
