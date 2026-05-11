import { Database } from "bun:sqlite";
import type { UrlEncurtada } from "./tipos";

const db = new Database("urls.db");

db.exec(`
  CREATE TABLE IF NOT EXISTS urls (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    codigo TEXT NOT NULL UNIQUE,
    urlOriginal TEXT NOT NULL,
    acessos INTEGER NOT NULL DEFAULT 0,
    criadoEm TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
    expiraEm TEXT
  );
`);

export function inserirUrl(
  codigo: string,
  urlOriginal: string,
  expiraEm?: string | null
): UrlEncurtada {

  const stmt = db.prepare(`
    INSERT INTO urls (codigo, urlOriginal, expiraEm)
    VALUES (?, ?, ?)
    RETURNING id, codigo, urlOriginal, acessos, criadoEm, expiraEm
  `);

  return stmt.get(
    codigo,
    urlOriginal,
    expiraEm ?? null
  ) as UrlEncurtada;
}

export function buscarPorCodigo(
  codigo: string
): UrlEncurtada | null {

  const stmt = db.prepare(
    "SELECT * FROM urls WHERE codigo = ?"
  );

  return (stmt.get(codigo) as UrlEncurtada) ?? null;
}

export function registrarAcesso(codigo: string): void {
  db.prepare(`
    UPDATE urls
    SET acessos = acessos + 1
    WHERE codigo = ?
  `).run(codigo);
}

export function listarUrls(): UrlEncurtada[] {
  return db.prepare(`
    SELECT *
    FROM urls
    ORDER BY id DESC
  `).all() as UrlEncurtada[];
}