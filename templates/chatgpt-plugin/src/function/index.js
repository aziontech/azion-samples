import { OpenAIRouter } from "../lib/openai-router";


async function handleRequest(request, args) {
  const router = OpenAIRouter();

  /**
   * Enter your plugin routes here
   * ex. router.get('/users', getUsersGithub)
   */
  router.get("/search", getRepos);
  router.all("*", () => {
    return new Response(`Template Edge Application ChatGPT Plugin on Azion`, { status: 200 });
  });

  return router.handle(request, { args });
}

/**
 * Handle to query repos
 * @param request
 * @param args
 * @returns
 */
const getRepos = async (request, extras) => {
  const { q } = request.query;
  const search = q || "azion cli";
  const url = `https://api.github.com/search/repositories?q=${search}`;

  const resp = await fetch(url, {
    headers: {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "Plugin AI - Azion ChatGPT Plugin Example",
    },
  });

  if (!resp.ok) {
    return new Response(await resp.text(), { status: 400 });
  }

  const json = await resp.json();

  const repos = json.items.map((item) => ({
    name: item.name,
    description: item.description,
    stars: item.stargazers_count,
    url: item.html_url,
  }));

  return new Response(JSON.stringify(repos), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};

export { handleRequest };
