import type { FastifyInstance } from "fastify";

export const registerHealthRoutes = async (app: FastifyInstance): Promise<void> => {
  app.get("/health", async () => ({
    status: "ok",
    service: "filadelfia-whatsapp-backend",
    timestamp: new Date().toISOString()
  }));
};
