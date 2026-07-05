import type { FastifyBaseLogger } from "fastify";
import { getEnv } from "../../config/env.js";
import type { NormalizedIncomingMessage } from "../../schemas/whatsapp.schema.js";
import { buildAutoReplyText } from "./whatsapp-auto-reply.service.js";
import { createWhatsAppCloudApiClient } from "./whatsapp-cloud-api.service.js";

export interface ReplySummary {
  failed: number;
  sent: number;
  skipped: number;
}

const createEmptySummary = (): ReplySummary => ({
  failed: 0,
  sent: 0,
  skipped: 0
});

export const replyToIncomingMessages = async (
  logger: FastifyBaseLogger,
  messages: NormalizedIncomingMessage[]
): Promise<ReplySummary> => {
  const env = getEnv();
  const client = createWhatsAppCloudApiClient({
    accessToken: env.metaWhatsAppAccessToken,
    graphApiVersion: env.metaGraphApiVersion,
    phoneNumberId: env.metaWhatsAppPhoneNumberId
  });
  const summary = createEmptySummary();

  for (const message of messages) {
    const replyText = buildAutoReplyText(message);

    if (!replyText) {
      summary.skipped += 1;
      continue;
    }

    try {
      const result = await client.sendTextMessage({
        body: replyText,
        to: message.from
      });

      if (result.success) {
        summary.sent += 1;
        continue;
      }

      if (result.skipped) {
        summary.skipped += 1;
        logger.warn(
          {
            event: "whatsapp.reply.skipped",
            reason: result.error
          },
          "WhatsApp reply skipped"
        );
        continue;
      }

      summary.failed += 1;
      logger.error(
        {
          event: "whatsapp.reply.failed",
          reason: result.error,
          statusCode: result.statusCode
        },
        "WhatsApp reply failed"
      );
    } catch (error) {
      summary.failed += 1;
      logger.error(
        {
          error,
          event: "whatsapp.reply.failed"
        },
        "WhatsApp reply failed"
      );
    }
  }

  return summary;
};
