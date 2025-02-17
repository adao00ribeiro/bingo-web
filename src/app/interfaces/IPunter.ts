import { ISeller } from "./ISeller"

export interface IPunter {
  id: string,
  balance:number
  email:string,
  cpf:string,
  dateBirth : string,
  seller : ISeller
}
