import { buildApp } from "./app.js";
import { getEnv } from "./config/env.js";
import { startWhatsAppBot } from "./services/whatsapp/baileys-whatsapp-bot.service.js";

const env = getEnv();
const app = buildApp({ logger: true });

const start = async (): Promise<void> => {
  try {
    await app.listen({
      host: env.host,
      port: env.port
    });

    if (env.whatsappBotEnabled) {
      await startWhatsAppBot(app.log);
    }
  } catch (error) {
    app.log.error(error, "Failed to start server");
    process.exit(1);
  }
};

void start();
