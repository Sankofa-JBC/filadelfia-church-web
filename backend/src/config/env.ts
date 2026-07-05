import "dotenv/config";

export interface AppEnv {
  nodeEnv: string;
  port: number;
  host: string;
  whatsappBotEnabled: boolean;
  whatsappIgnoreGroups: boolean;
  whatsappMinReplyIntervalMs: number;
  whatsappSessionDir: string;
}

const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? "3000");

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
};

const parseBoolean = (value: string | undefined, defaultValue: boolean): boolean => {
  if (value === undefined) {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(value.toLowerCase());
};

const parseNonNegativeInteger = (
  name: string,
  value: string | undefined,
  defaultValue: number
): number => {
  const parsed = Number(value ?? defaultValue);

  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${name} must be a non-negative integer.`);
  }

  return parsed;
};

export const getEnv = (): AppEnv => {
  const nodeEnv = process.env.NODE_ENV ?? "development";

  return {
    nodeEnv,
    port: parsePort(process.env.PORT),
    host: process.env.HOST ?? "0.0.0.0",
    whatsappBotEnabled: parseBoolean(process.env.WHATSAPP_BOT_ENABLED, false),
    whatsappIgnoreGroups: parseBoolean(process.env.WHATSAPP_IGNORE_GROUPS, true),
    whatsappMinReplyIntervalMs: parseNonNegativeInteger(
      "WHATSAPP_MIN_REPLY_INTERVAL_MS",
      process.env.WHATSAPP_MIN_REPLY_INTERVAL_MS,
      60_000
    ),
    whatsappSessionDir: process.env.WHATSAPP_SESSION_DIR ?? ".session/baileys"
  };
};
