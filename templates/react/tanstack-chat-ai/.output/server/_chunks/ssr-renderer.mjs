import { n as toRequest, t as HTTPError } from "../index.mjs";
//#region node_modules/.pnpm/nitro-nightly@3.0.1-20260605-145636-4ab22a9d_chokidar@5.0.0_jiti@2.7.0_vite@8.0.16_@typ_beeeaded0cd16e5ecc4159156dedffbd/node_modules/nitro-nightly/dist/runtime/vite.mjs
function fetchViteEnv(viteEnvName, input, init) {
	const viteEnv = (globalThis.__nitro_vite_envs__ || {})[viteEnvName];
	if (!viteEnv) throw HTTPError.status(404);
	return Promise.resolve(viteEnv.fetch(toRequest(input, init)));
}
//#endregion
//#region node_modules/.pnpm/nitro-nightly@3.0.1-20260605-145636-4ab22a9d_chokidar@5.0.0_jiti@2.7.0_vite@8.0.16_@typ_beeeaded0cd16e5ecc4159156dedffbd/node_modules/nitro-nightly/dist/runtime/internal/vite/ssr-renderer.mjs
/** @param {{ req: Request }} HTTPEvent */
function ssrRenderer({ req }) {
	return fetchViteEnv("ssr", req);
}
//#endregion
export { ssrRenderer as default };
