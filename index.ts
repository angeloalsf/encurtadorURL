import {
  inserirUrl,
  buscarPorCodigo,
  registrarAcesso,
  listarUrls
} from "./banco";

import {
  gerarCodigo,
  urlValida,
  codigoValido
} from "./util";

import type { RespostaErro } from "./tipos";

function json(
  dados: unknown,
  status: number = 200
): Response {

  return new Response(
    JSON.stringify(dados, null, 2),
    {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8"
      },
    }
  );
}

function erro(
  mensagem: string,
  status: number
): Response {

  const resp: RespostaErro = {
    erro: mensagem
  };

  return json(resp, status);
}

const servidor = Bun.serve({

  // DESAFIO E
  port: Number(Bun.env.PORTA) || 3000,

  async fetch(req: Request): Promise<Response> {

    const url = new URL(req.url);

    const caminho = url.pathname;

    const metodo = req.method;

    // POST /api/encurtar
    if (
      metodo === "POST" &&
      caminho === "/api/encurtar"
    ) {

      const corpo = await req.json() as {
        urlOriginal?: string;
        codigo?: string;
        expiraEm?: string;
      };

      if (
        !corpo.urlOriginal ||
        !urlValida(corpo.urlOriginal)
      ) {
        return erro(
          "URL inválida. Use http:// ou https://",
          400
        );
      }

      // DESAFIO A
      let codigo = corpo.codigo?.trim();

      if (codigo) {

        if (!codigoValido(codigo)) {
          return erro(
            "Código inválido. Use apenas letras e números (4-10 caracteres).",
            400
          );
        }

        const existente = buscarPorCodigo(codigo);

        if (existente) {
          return erro(
            "Código já está em uso",
            409
          );
        }

      } else {
        codigo = gerarCodigo();
      }

      // DESAFIO C
      const registro = inserirUrl(
        codigo,
        corpo.urlOriginal,
        corpo.expiraEm ?? null
      );

      return json(registro, 201);
    }

    // GET /api/urls
    if (
      metodo === "GET" &&
      caminho === "/api/urls"
    ) {
      return json(listarUrls());
    }

    // DESAFIO B
    // GET /stats/:codigo
    if (
      metodo === "GET" &&
      caminho.startsWith("/stats/")
    ) {

      const codigo = caminho.replace("/stats/", "");

      const registro = buscarPorCodigo(codigo);

      if (!registro) {
        return erro("Código não encontrado", 404);
      }

      const qrCode =
        `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(`${url.origin}/${codigo}`)}`;

      return new Response(`
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <title>Estatísticas</title>

          <style>
            body {
              font-family: system-ui;
              max-width: 700px;
              margin: 40px auto;
              padding: 20px;
            }

            .card {
              border: 1px solid #ddd;
              border-radius: 10px;
              padding: 20px;
            }

            img {
              margin-top: 20px;
            }

            a {
              color: #0d4f3c;
            }
          </style>
        </head>

        <body>

          <div class="card">

            <h1>Estatísticas da URL</h1>

            <p>
              <strong>Código:</strong>
              ${registro.codigo}
            </p>

            <p>
              <strong>URL original:</strong>
              <a href="${registro.urlOriginal}" target="_blank">
                ${registro.urlOriginal}
              </a>
            </p>

            <p>
              <strong>Acessos:</strong>
              ${registro.acessos}
            </p>

            <p>
              <strong>Criado em:</strong>
              ${registro.criadoEm}
            </p>

            <p>
              <strong>Expira em:</strong>
              ${registro.expiraEm ?? "Nunca"}
            </p>

            <img src="${qrCode}" alt="QR Code">

          </div>

        </body>
        </html>
      `, {
        headers: {
          "Content-Type": "text/html; charset=utf-8"
        }
      });
    }

    // GET /:codigo
    if (
      metodo === "GET" &&
      /^\/[A-Za-z0-9]{4,10}$/.test(caminho)
    ) {

      const codigo = caminho.slice(1);

      const registro = buscarPorCodigo(codigo);

      if (!registro) {
        return erro("Código não encontrado", 404);
      }

      // DESAFIO C
      if (registro.expiraEm) {

        const agora = new Date();

        const expiracao = new Date(
          registro.expiraEm
        );

        if (agora > expiracao) {
          return erro(
            "Link expirado",
            410
          );
        }
      }

      registrarAcesso(codigo);

      return Response.redirect(
        registro.urlOriginal,
        302
      );
    }

    // FRONTEND
    if (
      metodo === "GET" &&
      caminho === "/"
    ) {
      return new Response(
        Bun.file("./public/index.html")
      );
    }

    if (
      metodo === "GET" &&
      caminho === "/app.js"
    ) {
      return new Response(
        Bun.file("./public/app.js")
      );
    }

    return erro(
      "Rota não encontrada",
      404
    );
  },
});

console.log(
  `Servidor pronto em http://localhost:${servidor.port}`
);