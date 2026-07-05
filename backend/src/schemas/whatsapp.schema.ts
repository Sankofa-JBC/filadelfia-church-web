import { z } from "zod";

export const WhatsAppIncomingMessageSchema = z
  .object({
    from: z.string().min(1),
    id: z.string().optional(),
    timestamp: z.string().optional(),
    type: z.string().min(1),
    text: z
      .object({
        body: z.string().optional()
      })
      .passthrough()
      .optional()
  })
  .passthrough();

const OfficialWhatsAppWebhookPayloadSchema = z
  .object({
    object: z.string().optional(),
    entry: z
      .array(
        z
          .object({
            id: z.string().optional(),
            changes: z
              .array(
                z
                  .object({
                    field: z.string().optional(),
                    value: z
                      .object({
                        messaging_product: z.string().optional(),
                        metadata: z.record(z.unknown()).optional(),
                        contacts: z.array(z.record(z.unknown())).optional(),
                        messages: z.array(WhatsAppIncomingMessageSchema).optional()
                      })
                      .passthrough()
                  })
                  .passthrough()
              )
              .min(1)
          })
          .passthrough()
      )
      .min(1)
  })
  .passthrough();

const SimulatedWhatsAppWebhookPayloadSchema = z
  .object({
    messages: z.array(WhatsAppIncomingMessageSchema).min(1)
  })
  .passthrough();

export const WhatsAppWebhookPayloadSchema = z.union([
  OfficialWhatsAppWebhookPayloadSchema,
  SimulatedWhatsAppWebhookPayloadSchema
]);

export type WhatsAppIncomingMessage = z.infer<typeof WhatsAppIncomingMessageSchema>;
export type WhatsAppWebhookPayload = z.infer<typeof WhatsAppWebhookPayloadSchema>;

export interface NormalizedIncomingMessage {
  from: string;
  id?: string;
  timestamp?: string;
  type: string;
  text?: string;
}
