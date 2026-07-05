import Fastify, { type FastifyInstance } from "fastify";
import { registerHealthRoutes } from "./routes/health.routes.js";
import { registerWhatsAppWebhookRoutes } from "./routes/whatsapp-webhook.routes.js";

export interface BuildAppOptions {
  logger?: boolean;
}

export const buildApp = (options: BuildAppOptions = {}): FastifyInstance => {
  const app = Fastify({
    logger: options.logger ?? true
  });

  void app.register(registerHealthRoutes);
  void app.register(registerWhatsAppWebhookRoutes);

  return app;
};
