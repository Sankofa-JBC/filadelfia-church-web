import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { getEnv } from "../config/env.js";
import {
  extractIncomingMessages,
  logIncomingMessages,
  validateWebhookPayload
} from "../services/whatsapp/whatsapp-message.service.js";
import { replyToIncomingMessages } from "../services/whatsapp/whatsapp-reply.service.js";

const webhookVerificationQuerySchema = z.object({
  "hub.mode": z.string().optional(),
  "hub.verify_token": z.string().optional(),
  "hub.challenge": z.string().optional()
});

export const registerWhatsAppWebhookRoutes = async (
  app: FastifyInstance
): Promise<void> => {
  app.get("/webhook/whatsapp", async (request, reply) => {
    const parsedQuery = webhookVerificationQuerySchema.safeParse(request.query);

    if (!parsedQuery.success) {
      return reply.code(400).send({
        error: "Invalid webhook verification query."
      });
    }

    const query = parsedQuery.data;
    const env = getEnv();
    const isValidChallenge =
      query["hub.mode"] === "subscribe" &&
      query["hub.verify_token"] === env.whatsappVerifyToken &&
      typeof query["hub.challenge"] === "string";

    if (!isValidChallenge) {
      request.log.warn(
        {
          event: "whatsapp.webhook.verification_failed",
          mode: query["hub.mode"]
        },
        "WhatsApp webhook verification failed"
      );

      return reply.code(403).send({
        error: "Webhook verification failed."
      });
    }

    return reply.type("text/plain").send(query["hub.challenge"]);
  });

  app.post("/webhook/whatsapp", async (request, reply) => {
    const validation = validateWebhookPayload(request.body);

    if (!validation.success || !validation.payload) {
      return reply.code(400).send({
        error: "Invalid WhatsApp webhook payload.",
        details: validation.errors ?? []
      });
    }

    const messages = extractIncomingMessages(validation.payload);
    logIncomingMessages(request.log, messages);
    const replies = await replyToIncomingMessages(request.log, messages);

    return reply.code(200).send({
      replies,
      status: "received",
      receivedMessages: messages.length
    });
  });
};
