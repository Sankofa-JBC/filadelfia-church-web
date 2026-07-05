import { afterEach, describe, expect, it } from "vitest";
import type { FastifyInstance } from "fastify";
import { buildApp } from "../src/app.js";

let app: FastifyInstance | undefined;

const getApp = (): FastifyInstance => {
  app = buildApp({ logger: false });
  return app;
};

afterEach(async () => {
  await app?.close();
  app = undefined;
  delete process.env.WHATSAPP_BOT_ENABLED;
});

describe("GET /whatsapp/status", () => {
  it("returns the current bot status", async () => {
    process.env.WHATSAPP_BOT_ENABLED = "true";

    const response = await getApp().inject({
      method: "GET",
      url: "/whatsapp/status"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      botEnabled: true,
      status: {
        connection: "stopped"
      }
    });
  });
});
