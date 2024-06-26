import { web3Handler } from "../web3Handler";

export class Web3Service {
  public async safeTransfer(
    from: string,
    to: string,
    id: number,
    amount: number
  ) {
    const txHash = await web3Handler.safeTransferFrom(from, to, id, amount);
    return txHash;
  }
}
