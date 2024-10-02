export type ServerConfig = {
  host: string;
  port: number;
};

export type Config = {
  nodeEnv: string;
  connectionString: string;
  server: ServerConfig;
};
