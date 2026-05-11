const ALFABETO = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

export function gerarCodigo(tamanho: number = 6): string {
  let codigo = "";

  for (let i = 0; i < tamanho; i++) {
    const indice = Math.floor(Math.random() * ALFABETO.length);
    codigo += ALFABETO[indice];
  }

  return codigo;
}

export function urlValida(url: string): boolean {
  try {
    const u = new URL(url);

    return u.protocol === "http:" || u.protocol === "https:";
  } catch {
    return false;
  }
}

export function codigoValido(codigo: string): boolean {
  return /^[A-Za-z0-9]{4,10}$/.test(codigo);
}