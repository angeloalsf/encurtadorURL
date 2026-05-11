import {
  expect,
  test,
  describe
} from "bun:test";

import {
  gerarCodigo,
  urlValida,
  codigoValido
} from "./util";

describe("gerarCodigo", () => {

  test("gera 6 caracteres por padrão", () => {

    expect(
      gerarCodigo()
    ).toHaveLength(6);

  });

});

describe("urlValida", () => {

  test("aceita https", () => {

    expect(
      urlValida("https://google.com")
    ).toBe(true);

  });

  test("rejeita texto inválido", () => {

    expect(
      urlValida("abc")
    ).toBe(false);

  });

});

describe("codigoValido", () => {

  test("aceita código válido", () => {

    expect(
      codigoValido("abc123")
    ).toBe(true);

  });

  test("rejeita código inválido", () => {

    expect(
      codigoValido("@@@")
    ).toBe(false);

  });

});