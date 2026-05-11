const btn = document.getElementById("btn");

const input = document.getElementById("url");

const codigo = document.getElementById("codigo");

const expiraEm = document.getElementById("expiraEm");

const resultado = document.getElementById("resultado");

const tbody = document.querySelector("#tabela tbody");

async function carregarLista() {

  const resp = await fetch("/api/urls");

  const lista = await resp.json();

  tbody.innerHTML = lista.map(u => `
    <tr>
      <td>
        <a href="/${u.codigo}" target="_blank">
          ${u.codigo}
        </a>
      </td>

      <td>${u.urlOriginal}</td>

      <td>${u.acessos}</td>

      <td>
        ${u.expiraEm ?? "Nunca"}
      </td>

      <td>
        <a href="/stats/${u.codigo}" target="_blank">
          Ver stats
        </a>
      </td>
    </tr>
  `).join("");
}

btn.addEventListener("click", async () => {

  const resp = await fetch(
    "/api/encurtar",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        urlOriginal: input.value,
        codigo: codigo.value || undefined,
        expiraEm: expiraEm.value || null
      }),
    }
  );

  const dados = await resp.json();

  if (!resp.ok) {

    resultado.innerHTML = `
      <div class="resultado">
        ${dados.erro}
      </div>
    `;

    return;
  }

  const curta =
    `${location.origin}/${dados.codigo}`;

  resultado.innerHTML = `
    <div class="resultado">

      URL curta:

      <a href="${curta}" target="_blank">
        ${curta}
      </a>

    </div>
  `;

  input.value = "";
  codigo.value = "";
  expiraEm.value = "";

  carregarLista();
});

carregarLista();