export default function getConfig() {
  return {
    nodeEnv: process.env.NODE_ENV,
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
    databaseUrl: process.env.DATABASE_URL,
  };
}
