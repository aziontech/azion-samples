// defining process.env because the upstash lib is for Node.js.
globalThis.process = { env: { UPSTASH_DISABLE_TELEMETRY: 1 } };

import { Redis } from "@upstash/redis";

const redisGet = async (search, config) => {
  try {
    const redis = new Redis(config);
    const result = await redis.get(search);
    if (!result) {
      return { result, status: 404 };
    }
    return { result, status: 200 };
  } catch (error) {
    console.log(error?.message)
    return { result: error?.message || "fail get item", status: 500 };
  }
};


const redisSet = async (key, value, config) => {
  try {
    const redis = new Redis(config);
    const result = await redis.set(key, value);
    if (!result) {
      return { result, status: 400 };
    }
    return { result, status: 200 };
  } catch (error) {
    console.log(error?.message)
    return { result: error?.message || "fail set item", status: 500 };
  }
};

export { redisGet, redisSet };
