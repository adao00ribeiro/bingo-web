import { ERechargeStatus } from "../enums/ERechargeStatus";

export interface IRecharge {
      id: string,
      value :number
      status : ERechargeStatus.PENDING;
      qrcode : string,
      imagemQrcode : string,
      punterId : string,
      createdAt?: string
   //   Punter { get; set; }
}
