import { Client, fql } from "fauna/dist/node/index.js";

const FaunaClient = (config) => {
  const client = new Client({
    secret: config?.secret,
  });
  return client;
};

export { FaunaClient, fql };
