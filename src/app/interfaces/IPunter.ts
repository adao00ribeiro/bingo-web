import { ISeller } from "./ISeller"
import { IUser } from "./IUser"

export interface IPunter {
  id: string,
  name:string,
  balance:number,
  prizeBalance:number,
  email:string,
  cpf:string,
  dateBirth : string,
  seller : ISeller,
  user: IUser
}
