import { Router } from "itty-router";
import schemaPluginDefault from "../schemas/api-plugin.json";
import schemaOpenApiDefault from "../schemas/openapi.json";

export const OpenAIRouter = () => {
  const router = Router();
  router
    .get("/openapi.json", schemaOpenApi)
    .get("/.well-known/ai-plugin.json", schemaPlugin);

  return router;
};

const schemaOpenApi = (request, extras) => {
  const host = request.headers.get("host") || "/";
  let schema = JSON.parse(JSON.stringify(schemaOpenApiDefault));
  schema.servers[0].url = `https://${host}`;
  return new Response(JSON.stringify(schema), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};

const schemaPlugin = (request, extras) => {
  const host = request.headers.get("host") || "/";
  let schemaPlugin = JSON.parse(JSON.stringify(schemaPluginDefault));
  /**
   * replaces the default values with the values informed in the args,
   * ( { plugin: (OpenAIRouterOptions) } args.json on .github/workflows/main.yml) or change schemas/api-plugin.json
   * */
  if (extras?.args?.plugin) {
    schemaPlugin = Object.assign(schemaPlugin, extras.args.plugin)
  }
  const schemaPluginApi = Object.assign(schemaPlugin.api, { url: `https://${host}${schemaPlugin.api.url}` });
  const schema = Object.assign(schemaPlugin, { api: schemaPluginApi });
  return new Response(JSON.stringify(schema), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};
