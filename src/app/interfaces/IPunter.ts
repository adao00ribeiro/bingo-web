import { ISeller } from "./ISeller"
import { IUser } from "./IUser"
import { IOnlineHouseResponse } from "./response/bingo/IOnlineHouseResponse"

export interface IPunter {
  id: string,
  name:string,
  balance:number,
  prizeBalance:number,
  email:string,
  cpf:string,
  dateBirth : string,
  onlineHouse : IOnlineHouseResponse,
  user: IUser
}
