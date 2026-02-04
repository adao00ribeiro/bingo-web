import { EPaymentMethodType } from "../../../enums/EPaymentMethodType";

export interface IPaymentMethodResponse {
  id: string;
  name: string;
  type: EPaymentMethodType;
  token?: string;
  pixPayload? :string;
  qrCodeUrl?: string;
  instructions?: string;
  active: boolean;
}
