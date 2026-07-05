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
});

describe("GET /health", () => {
  it("returns service health", async () => {
    const response = await getApp().inject({
      method: "GET",
      url: "/health"
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      status: "ok",
      service: "filadelfia-whatsapp-backend"
    });
  });
});
