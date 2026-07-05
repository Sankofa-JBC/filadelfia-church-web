import type { FastifyBaseLogger } from "fastify";
import {
  type NormalizedIncomingMessage,
  type WhatsAppIncomingMessage,
  type WhatsAppWebhookPayload,
  WhatsAppWebhookPayloadSchema
} from "../../schemas/whatsapp.schema.js";

export interface PayloadValidationResult {
  success: boolean;
  payload?: WhatsAppWebhookPayload;
  errors?: string[];
}

const normalizeMessage = (message: WhatsAppIncomingMessage): NormalizedIncomingMessage => ({
  from: message.from,
  id: message.id,
  timestamp: message.timestamp,
  type: message.type,
  text: message.text?.body
});

export const validateWebhookPayload = (payload: unknown): PayloadValidationResult => {
  const result = WhatsAppWebhookPayloadSchema.safeParse(payload);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.issues.map((issue) => issue.message)
    };
  }

  return {
    success: true,
    payload: result.data
  };
};

export const extractIncomingMessages = (
  payload: WhatsAppWebhookPayload
): NormalizedIncomingMessage[] => {
  const simulatedPayload = payload as { messages?: unknown };

  if (Array.isArray(simulatedPayload.messages)) {
    return simulatedPayload.messages.map((message) =>
      normalizeMessage(message as WhatsAppIncomingMessage)
    );
  }

  const officialPayload = payload as {
    entry?: Array<{
      changes?: Array<{
        value?: {
          messages?: WhatsAppIncomingMessage[];
        };
      }>;
    }>;
  };

  return (officialPayload.entry ?? []).flatMap((entry) =>
    (entry.changes ?? []).flatMap((change) =>
      (change.value?.messages ?? []).map(normalizeMessage)
    )
  );
};

export const logIncomingMessages = (
  logger: FastifyBaseLogger,
  messages: NormalizedIncomingMessage[]
): void => {
  for (const message of messages) {
    logger.info(
      {
        event: "whatsapp.message.received",
        from: message.from,
        id: message.id,
        type: message.type,
        text: message.text,
        timestamp: message.timestamp
      },
      "Received WhatsApp webhook message"
    );
  }
};
