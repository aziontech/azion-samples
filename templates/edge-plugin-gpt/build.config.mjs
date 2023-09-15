import * as esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["./src/index.ts"],
    outfile: "./worker/function.js",
    bundle: true,
    minify: true,
    sourcemap: false,
    platform: 'browser',
    format: "esm",
    define: { "process": JSON.stringify({ env: {}}) },
    tsconfig: "./tsconfig.json",
  })
  .then(() => console.log("⚡Bundle build complete ⚡"))
  .catch(() => {
    process.exit(1);
  });
