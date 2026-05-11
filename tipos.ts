export interface UrlEncurtada {
  id: number;
  codigo: string;
  urlOriginal: string;
  acessos: number;
  criadoEm: string;
  expiraEm?: string | null;
}

export interface RespostaErro {
  erro: string;
}