const { EleventyEdgePlugin } = require("@11ty/eleventy");
require("dotenv").config();

module.exports = function(eleventyConfig) {
	eleventyConfig.addPlugin(EleventyEdgePlugin);
	eleventyConfig.addPassthroughCopy("src/assets/**");

	return {
    	dir: {
        	input: "src",
        	output: "_site"
    	}
	};
};
