import { ISmptSettings } from "./ISmtpSettings";

export interface IEmailConfig{
    primarySmtp: ISmptSettings;
    fromAddress: string;
    fromName: string;
}
