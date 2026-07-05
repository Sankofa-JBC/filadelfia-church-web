import { extractMessageContent, type WAMessage } from "baileys";
import type { NormalizedIncomingMessage } from "../../schemas/whatsapp.schema.js";

export interface BaileysNormalizedMessage extends NormalizedIncomingMessage {
  jid: string;
}

const getMessageText = (message: WAMessage): string | undefined => {
  const content = extractMessageContent(message.message);

  return (
    content?.conversation ??
    content?.extendedTextMessage?.text ??
    content?.imageMessage?.caption ??
    content?.videoMessage?.caption ??
    undefined
  );
};

export const isGroupJid = (jid: string): boolean => jid.endsWith("@g.us");

export const isStatusJid = (jid: string): boolean => jid === "status@broadcast";

export const normalizeBaileysMessage = (
  message: WAMessage
): BaileysNormalizedMessage | undefined => {
  const jid = message.key.remoteJid;

  if (!jid || message.key.fromMe || isStatusJid(jid)) {
    return undefined;
  }

  const text = getMessageText(message);

  return {
    from: jid.replace(/@s\.whatsapp\.net$|@lid$/, ""),
    id: message.key.id ?? undefined,
    jid,
    text,
    timestamp: message.messageTimestamp?.toString(),
    type: text ? "text" : "unsupported"
  };
};
