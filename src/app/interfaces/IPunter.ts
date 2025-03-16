import { ISeller } from "./ISeller"

export interface IPunter {
  id: string,
  name:string,
  balance:number
  email:string,
  cpf:string,
  dateBirth : string,
  seller : ISeller
}
