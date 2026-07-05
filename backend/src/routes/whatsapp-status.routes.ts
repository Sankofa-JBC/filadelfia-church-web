import type { FastifyInstance } from "fastify";
import { getEnv } from "../config/env.js";
import { getWhatsAppBotStatus } from "../services/whatsapp/whatsapp-bot-status.service.js";

export const registerWhatsAppStatusRoutes = async (
  app: FastifyInstance
): Promise<void> => {
  app.get("/whatsapp/status", async () => {
    const env = getEnv();

    return {
      botEnabled: env.whatsappBotEnabled,
      status: getWhatsAppBotStatus()
    };
  });
};
