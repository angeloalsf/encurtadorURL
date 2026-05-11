// tipos.ts
export interface UrlEncurtada {
  id: number;
  codigo: string;       // ex.: "aB3xK9"
  urlOriginal: string;  // URL completa
  acessos: number;
  criadoEm: string;     // ISO datetime
}
export interface RespostaErro {
  erro: string;
}