// docs: https://www.11ty.dev/docs/config/
export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy("src/css");

  return {
    dir: {
      input: "src",
      output: "_site"
    }
  };
}
