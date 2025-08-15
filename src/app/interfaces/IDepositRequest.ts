
export interface IDepositRequest {
  value: number;
  amount:number;
  network?: string;
  token?: string;
  transactionHash?: string;
  address?: string;
}
