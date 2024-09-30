/**
 * Retrieves the application configuration.
 *
 * @returns {{ nodeEnv: string, host: string, port: number, databaseUrl: string }}
 */
export default function getConfig() {
  return {
    nodeEnv: process.env.NODE_ENV || "development",
    host: process.env.SERVER_HOST || "localhost",
    port: Number(process.env.SERVER_PORT) || 3000,
    databaseUrl: process.env.DATABASE_URL || "",
  };
}
