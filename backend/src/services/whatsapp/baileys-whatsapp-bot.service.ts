import makeWASocket, {
  Browsers,
  DisconnectReason,
  useMultiFileAuthState,
  type WAMessage,
  type WASocket
} from "baileys";
import type { FastifyBaseLogger } from "fastify";
import Pino from "pino";
import QRCode from "qrcode";
import { getEnv } from "../../config/env.js";
import {
  isGroupJid,
  normalizeBaileysMessage,
  type BaileysNormalizedMessage
} from "./baileys-message.mapper.js";
import { buildAutoReplyText } from "./whatsapp-auto-reply.service.js";
import {
  incrementWhatsAppBotMessageCount,
  incrementWhatsAppBotReplyCount,
  setWhatsAppBotConnection,
  setWhatsAppBotQrEmitted,
  setWhatsAppBotSessionDir
} from "./whatsapp-bot-status.service.js";

let socket: WASocket | undefined;
let startPromise: Promise<void> | undefined;
let reconnectTimer: NodeJS.Timeout | undefined;
const lastReplyByJid = new Map<string, number>();

const getDisconnectCode = (error: unknown): number | undefined =>
  (error as { output?: { statusCode?: number } } | undefined)?.output?.statusCode;

const shouldReplyNow = (message: BaileysNormalizedMessage, intervalMs: number): boolean => {
  if (intervalMs === 0) {
    return true;
  }

  const now = Date.now();
  const lastReplyAt = lastReplyByJid.get(message.jid) ?? 0;

  if (now - lastReplyAt < intervalMs) {
    return false;
  }

  lastReplyByJid.set(message.jid, now);
  return true;
};

const handleIncomingMessage = async (
  logger: FastifyBaseLogger,
  message: WAMessage
): Promise<void> => {
  const env = getEnv();
  const normalized = normalizeBaileysMessage(message);

  if (!normalized) {
    return;
  }

  if (env.whatsappIgnoreGroups && isGroupJid(normalized.jid)) {
    logger.info(
      {
        event: "whatsapp.bot.group_message_ignored",
        jid: normalized.jid
      },
      "WhatsApp group message ignored"
    );
    return;
  }

  incrementWhatsAppBotMessageCount();

  if (!shouldReplyNow(normalized, env.whatsappMinReplyIntervalMs)) {
    logger.info(
      {
        event: "whatsapp.bot.reply_rate_limited",
        jid: normalized.jid
      },
      "WhatsApp bot reply rate limited"
    );
    return;
  }

  const replyText = buildAutoReplyText(normalized);

  if (!replyText || !socket) {
    return;
  }

  await socket.sendMessage(normalized.jid, {
    text: replyText
  });
  incrementWhatsAppBotReplyCount();
  logger.info(
    {
      event: "whatsapp.bot.reply_sent",
      jid: normalized.jid,
      messageId: normalized.id
    },
    "WhatsApp bot reply sent"
  );
};

const connect = async (logger: FastifyBaseLogger): Promise<void> => {
  const env = getEnv();
  setWhatsAppBotSessionDir(env.whatsappSessionDir);
  setWhatsAppBotConnection("connecting");

  const { saveCreds, state } = await useMultiFileAuthState(env.whatsappSessionDir);
  const baileysLogger = Pino({
    level: process.env.BAILEYS_LOG_LEVEL ?? "silent"
  });

  socket = makeWASocket({
    auth: state,
    browser: Browsers.windows("Filadelfia Bot"),
    getMessage: async () => undefined,
    logger: baileysLogger,
    markOnlineOnConnect: false,
    syncFullHistory: false
  });

  socket.ev.on("creds.update", saveCreds);

  socket.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr) {
      setWhatsAppBotQrEmitted();
      const qrCode = await QRCode.toString(qr, {
        small: true,
        type: "terminal"
      });
      console.log(qrCode);
      console.log("Escaneie o QR Code no WhatsApp: Aparelhos conectados > Conectar aparelho.");
    }

    if (connection === "open") {
      setWhatsAppBotConnection("open");
      logger.info("WhatsApp bot connected");
      return;
    }

    if (connection === "close") {
      const disconnectCode = getDisconnectCode(lastDisconnect?.error);
      setWhatsAppBotConnection("close", disconnectCode);
      socket = undefined;

      if (disconnectCode === DisconnectReason.loggedOut) {
        logger.error(
          {
            event: "whatsapp.bot.logged_out"
          },
          "WhatsApp bot logged out. Remove backend/.session/baileys and scan QR Code again."
        );
        return;
      }

      if (!reconnectTimer) {
        reconnectTimer = setTimeout(() => {
          reconnectTimer = undefined;
          void connect(logger);
        }, disconnectCode === DisconnectReason.restartRequired ? 250 : 5_000);
      }
    }
  });

  socket.ev.on("messages.upsert", (event) => {
    if (event.type !== "notify") {
      return;
    }

    for (const message of event.messages) {
      void handleIncomingMessage(logger, message).catch((error: unknown) => {
        logger.error(
          {
            error,
            event: "whatsapp.bot.reply_failed"
          },
          "WhatsApp bot reply failed"
        );
      });
    }
  });
};

export const startWhatsAppBot = async (logger: FastifyBaseLogger): Promise<void> => {
  if (!startPromise) {
    startPromise = connect(logger);
  }

  await startPromise;
};
