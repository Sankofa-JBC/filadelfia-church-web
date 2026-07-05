import "dotenv/config";

export interface AppEnv {
  nodeEnv: string;
  port: number;
  host: string;
  whatsappVerifyToken: string;
}

const parsePort = (value: string | undefined): number => {
  const port = Number(value ?? "3000");

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error("PORT must be an integer between 1 and 65535.");
  }

  return port;
};

export const getEnv = (): AppEnv => {
  const nodeEnv = process.env.NODE_ENV ?? "development";
  const whatsappVerifyToken =
    process.env.WHATSAPP_VERIFY_TOKEN ??
    (nodeEnv === "production" ? "" : "local-dev-verify-token");

  if (nodeEnv === "production" && whatsappVerifyToken.length === 0) {
    throw new Error("WHATSAPP_VERIFY_TOKEN is required in production.");
  }

  return {
    nodeEnv,
    port: parsePort(process.env.PORT),
    host: process.env.HOST ?? "0.0.0.0",
    whatsappVerifyToken
  };
};
