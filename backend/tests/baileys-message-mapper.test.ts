import type { WAMessage } from "baileys";
import { describe, expect, it } from "vitest";
import {
  isGroupJid,
  normalizeBaileysMessage
} from "../src/services/whatsapp/baileys-message.mapper.js";

describe("normalizeBaileysMessage", () => {
  it("normalizes incoming text messages", () => {
    const message = {
      key: {
        fromMe: false,
        id: "msg-1",
        remoteJid: "5521999999999@s.whatsapp.net"
      },
      message: {
        conversation: "Quais sao os cultos?"
      },
      messageTimestamp: 1710000000
    } as unknown as WAMessage;

    expect(normalizeBaileysMessage(message)).toEqual({
      from: "5521999999999",
      id: "msg-1",
      jid: "5521999999999@s.whatsapp.net",
      text: "Quais sao os cultos?",
      timestamp: "1710000000",
      type: "text"
    });
  });

  it("ignores messages sent by the bot account", () => {
    const message = {
      key: {
        fromMe: true,
        remoteJid: "5521999999999@s.whatsapp.net"
      },
      message: {
        conversation: "Mensagem enviada pelo proprio bot"
      }
    } as unknown as WAMessage;

    expect(normalizeBaileysMessage(message)).toBeUndefined();
  });
});

describe("isGroupJid", () => {
  it("detects WhatsApp group JIDs", () => {
    expect(isGroupJid("123456789@g.us")).toBe(true);
    expect(isGroupJid("5521999999999@s.whatsapp.net")).toBe(false);
  });
});
