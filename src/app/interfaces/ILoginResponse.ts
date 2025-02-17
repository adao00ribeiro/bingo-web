export interface ILoginResponse {
  sucesso: boolean;
  accessToken?: string; // Opcional, pois pode ser ignorado se for null
  refreshToken?: string; // Opcional, pois pode ser ignorado se for null
  erros: string[];
}
