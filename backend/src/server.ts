import { buildApp } from "./app.js";
import { getEnv } from "./config/env.js";

const env = getEnv();
const app = buildApp({ logger: true });

const start = async (): Promise<void> => {
  try {
    await app.listen({
      host: env.host,
      port: env.port
    });
  } catch (error) {
    app.log.error(error, "Failed to start server");
    process.exit(1);
  }
};

void start();
