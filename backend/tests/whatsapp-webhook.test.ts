import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";

let app: FastifyInstance | undefined;

const getApp = (): FastifyInstance => {
  app = buildApp({ logger: false });
  return app;
};

beforeEach(() => {
  process.env.WHATSAPP_VERIFY_TOKEN = "test-token";
});

afterEach(async () => {
  await app?.close();
  app = undefined;
  delete process.env.WHATSAPP_VERIFY_TOKEN;
  delete process.env.META_WHATSAPP_ACCESS_TOKEN;
  delete process.env.META_WHATSAPP_PHONE_NUMBER_ID;
  delete process.env.META_GRAPH_API_VERSION;
});

describe("GET /webhook/whatsapp", () => {
  it("returns the challenge when Meta verification data is valid", async () => {
    const response = await getApp().inject({
      method: "GET",
      url: "/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=test-token&hub.challenge=abc123"
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toBe("abc123");
  });

  it("rejects invalid verification tokens", async () => {
    const response = await getApp().inject({
      method: "GET",
      url: "/webhook/whatsapp?hub.mode=subscribe&hub.verify_token=wrong&hub.challenge=abc123"
    });

    expect(response.statusCode).toBe(403);
  });
});

describe("POST /webhook/whatsapp", () => {
  it("accepts a simulated incoming text message", async () => {
    const response = await getApp().inject({
      method: "POST",
      url: "/webhook/whatsapp",
      payload: {
        messages: [
          {
            from: "5521974350384",
            id: "wamid.test",
            timestamp: "1710000000",
            type: "text",
            text: {
              body: "Ola, gostaria de saber os horarios dos cultos."
            }
          }
        ]
      }
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toEqual({
      replies: {
        failed: 0,
        sent: 0,
        skipped: 1
      },
      status: "received",
      receivedMessages: 1
    });
  });

  it("rejects invalid payloads", async () => {
    const response = await getApp().inject({
      method: "POST",
      url: "/webhook/whatsapp",
      payload: {}
    });

    expect(response.statusCode).toBe(400);
  });
});
