export type WhatsAppBotConnection = "close" | "connecting" | "open" | "stopped";

export interface WhatsAppBotStatus {
  connection: WhatsAppBotConnection;
  lastDisconnectCode?: number;
  lastQrAt?: string;
  lastStartedAt?: string;
  messageCount: number;
  replyCount: number;
  sessionDir?: string;
}

const status: WhatsAppBotStatus = {
  connection: "stopped",
  messageCount: 0,
  replyCount: 0
};

export const getWhatsAppBotStatus = (): WhatsAppBotStatus => ({
  ...status
});

export const setWhatsAppBotConnection = (
  connection: WhatsAppBotConnection,
  lastDisconnectCode?: number
): void => {
  status.connection = connection;
  status.lastDisconnectCode = lastDisconnectCode;

  if (connection === "connecting") {
    status.lastStartedAt = new Date().toISOString();
  }
};

export const setWhatsAppBotQrEmitted = (): void => {
  status.lastQrAt = new Date().toISOString();
};

export const setWhatsAppBotSessionDir = (sessionDir: string): void => {
  status.sessionDir = sessionDir;
};

export const incrementWhatsAppBotMessageCount = (): void => {
  status.messageCount += 1;
};

export const incrementWhatsAppBotReplyCount = (): void => {
  status.replyCount += 1;
};
