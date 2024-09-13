import { Web3Handler } from "web3-handler";

export const web3Handler = new Web3Handler(
  process.env.CONTRACT_PROXY,
  process.env.WEB3_INFURA_PROVIDER_URL,
  process.env.WEB3_ACC_PRIVATE_KEY
);
