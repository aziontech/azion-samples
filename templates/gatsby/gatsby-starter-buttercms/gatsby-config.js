require("dotenv").config()

const previewMode = !(process.env.BUTTER_CMS_PREVIEW === "false" || process.env.BUTTER_CMS_PREVIEW === "0") ? 1 : 0

module.exports = {
  siteMetadata: {
    title: `ButterCMS Gatsby.js Starter Project`,
    siteUrl: `https://gatsbyjs-starter-buttercms-vercel.vercel.app/`,
  },
  plugins: [
    {
      resolve: `gatsby-source-buttercms`,
      options: {
        authToken: process.env.BUTTER_CMS_API_KEY,
        // Use the optional contentFields array for ButterCMS Collections. Any
        // Collections you want the app to have access to should have their
        // slugs explicitly included in the keys array, as seen below.
        contentFields: {
          keys: [`navigation_menu`],
          // Optional. Set to 1 to enable test mode for viewing draft content.
          test: previewMode,
        },
        // Use the optional pageTypes array for ButterCMS PageTypes. Any 
        // Page Types you want the app to have access to should have their
        // slugs explicitly included in the pageTypes array, as seen below.
        pageTypes: [`landing-page`],
        // Specify locales you want the app to have access to, if you have 
        // locales enabled in your account.
        locales: [],
        preview: previewMode, // Return draft content
        levels: 2 // Optional. Defaults to 2. Defines the levels of relationships to serialize
      },
    },
    `gatsby-plugin-react-helmet`
  ]
}
