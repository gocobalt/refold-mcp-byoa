import z from "zod";

const Config = z.object({
    MODEL_NAME: z.string(),
    MODEL_URL: z.string(),
    MODEL_API_KEY: z.string(),
    MCP_URL: z.string(),
  });

  export const config = Config.parse(process.env);