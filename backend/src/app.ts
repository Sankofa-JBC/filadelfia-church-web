import Fastify, { type FastifyInstance } from "fastify";
import { registerHealthRoutes } from "./routes/health.routes.js";
import { registerWhatsAppStatusRoutes } from "./routes/whatsapp-status.routes.js";

export interface BuildAppOptions {
  logger?: boolean;
}

export const buildApp = (options: BuildAppOptions = {}): FastifyInstance => {
  const app = Fastify({
    logger: options.logger ?? true
  });

  void app.register(registerHealthRoutes);
  void app.register(registerWhatsAppStatusRoutes);

  return app;
};
