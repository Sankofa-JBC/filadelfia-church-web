export interface WhatsAppCloudClientConfig {
  accessToken?: string;
  graphApiVersion: string;
  phoneNumberId?: string;
}

export interface SendTextMessageInput {
  body: string;
  to: string;
}

export interface SendTextMessageResult {
  error?: string;
  skipped: boolean;
  statusCode?: number;
  success: boolean;
}

export type FetchFn = typeof fetch;

export const createWhatsAppCloudApiClient = (
  config: WhatsAppCloudClientConfig,
  fetchFn: FetchFn = fetch
) => {
  const sendTextMessage = async (
    input: SendTextMessageInput
  ): Promise<SendTextMessageResult> => {
    if (!config.accessToken || !config.phoneNumberId) {
      return {
        error: "WhatsApp Cloud API credentials are not configured.",
        skipped: true,
        success: false
      };
    }

    const url = `https://graph.facebook.com/${config.graphApiVersion}/${config.phoneNumberId}/messages`;
    const response = await fetchFn(url, {
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to: input.to,
        type: "text",
        text: {
          body: input.body,
          preview_url: false
        }
      }),
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    if (!response.ok) {
      const errorBody = await response.text();

      return {
        error: errorBody,
        skipped: false,
        statusCode: response.status,
        success: false
      };
    }

    return {
      skipped: false,
      statusCode: response.status,
      success: true
    };
  };

  return {
    sendTextMessage
  };
};
