import { describe, expect, it, vi } from "vitest";
import {
  createWhatsAppCloudApiClient,
  type FetchFn
} from "../src/services/whatsapp/whatsapp-cloud-api.service.js";

describe("createWhatsAppCloudApiClient", () => {
  it("skips sending when credentials are missing", async () => {
    const client = createWhatsAppCloudApiClient({
      graphApiVersion: "v24.0"
    });

    const result = await client.sendTextMessage({
      body: "Teste",
      to: "5521999999999"
    });

    expect(result).toMatchObject({
      skipped: true,
      success: false
    });
  });

  it("sends text messages to the WhatsApp Cloud API", async () => {
    const fetchMock = vi.fn(async () => new Response("{}", { status: 200 })) as unknown as FetchFn;
    const client = createWhatsAppCloudApiClient(
      {
        accessToken: "access-token",
        graphApiVersion: "v24.0",
        phoneNumberId: "phone-number-id"
      },
      fetchMock
    );

    const result = await client.sendTextMessage({
      body: "Graca e paz!",
      to: "5521999999999"
    });

    expect(result).toEqual({
      skipped: false,
      statusCode: 200,
      success: true
    });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://graph.facebook.com/v24.0/phone-number-id/messages",
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: "Bearer access-token",
          "Content-Type": "application/json"
        }),
        method: "POST"
      })
    );
  });
});
