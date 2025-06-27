export interface IRegister {
  name: string;
  userName: string;
  email: string;
  phone: string;
  cpf: string;
  password: string;
  passwordConfirmed: string;
  dateBirth: string; // ou Date, dependendo do uso
  sellerId: string; // UUID format
  registeredWithTag:string;
}
