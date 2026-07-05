import { describe, expect, it } from "vitest";
import { buildAutoReplyText } from "../src/services/whatsapp/whatsapp-auto-reply.service.js";

describe("buildAutoReplyText", () => {
  it("returns service schedule when the user asks about cultos", () => {
    const reply = buildAutoReplyText({
      from: "5521999999999",
      text: "Quais sao os horarios dos cultos?",
      type: "text"
    });

    expect(reply).toContain("domingo as 10h");
    expect(reply).toContain("quarta-feira as 19h");
  });

  it("returns church location when the user asks where the church is", () => {
    const reply = buildAutoReplyText({
      from: "5521999999999",
      text: "Onde fica a igreja?",
      type: "text"
    });

    expect(reply).toContain("Colubande");
    expect(reply).toContain("Sao Goncalo");
  });

  it("returns prayer guidance when the user asks for prayer", () => {
    const reply = buildAutoReplyText({
      from: "5521999999999",
      text: "Tenho um pedido de oracao",
      type: "text"
    });

    expect(reply).toContain("pedido de oracao");
  });
});
