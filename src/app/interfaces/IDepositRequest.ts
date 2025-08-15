
export interface IDepositRequest {
  value: number;
  network?: string;
  token?: string;
  transactionHash?: string;
  address?: string;
}
