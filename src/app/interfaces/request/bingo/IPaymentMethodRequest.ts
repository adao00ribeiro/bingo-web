import { EPaymentMethodType } from "../../../enums/EPaymentMethodType";

export interface IPaymentMethodRequest {
  id?: string;
  name: string;
  type: EPaymentMethodType;
  token?: string;
  qrCodeUrl?: string;
  instructions?: string;
  active: boolean;
}
