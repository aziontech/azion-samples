// docs: https://www.11ty.io/docs/config/
const fs = require("fs");
const path = require('path');

module.exports = function(eleventyConfig) {
   
  eleventyConfig.setBrowserSyncConfig({
    
   callbacks: {
     // add a 404 page
    /*   ready: function(err, bs) {
         const content_404 = fs.readFileSync('_site/404.html');
         bs.addMiddleware("*", (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404);
          res.end();
        });
       }, */
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
    }
  });
  eleventyConfig.addPassthroughCopy("src/css");
  
  return {
    passthroughFileCopy: true,
    dir: {
      input: "src",
      output: "_site"
    }
  };
};
