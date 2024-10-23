const butterCmsApiKey = process.env.BUTTER_CMS_API_KEY
const butterCmsPreview = !(process.env.BUTTER_CMS_PREVIEW === "false" || process.env.BUTTER_CMS_PREVIEW === "0")
const butterSdk = require("buttercms");

exports.onPreBootstrap = async () => {
  const butter = butterSdk(butterCmsApiKey, butterCmsPreview);
  try {
    await butter.category.list()
  } catch (e) {
    if (butterCmsApiKey) throw new Error("Your Butter token is set to an invalid value. Please verify your token is correct.")
  }
}

exports.onCreatePage = ({ page, actions }) => {
  const { deletePage, createPage } = actions

  if (page.path === '/dev-404-page/') {
    deletePage(page)
  } else if (page.path === '/404/') {
    deletePage(page)
    if (!butterCmsApiKey) {
      createPage({ ...page, component: require.resolve(`./src/templates/noApiKey.js`)})
    } else {
      createPage(page)
    }
  }
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions;
  const butter = butterSdk(butterCmsApiKey, butterCmsPreview);

  // FIXME: no possibility to query categories and tags via GraphQL
  let categories = (await butter.category.list()).data.data;
  let tags = (await butter.tag.list()).data.data;

  const landingPage = await graphql(`
    query {
      butterPage(slug: {eq: "landing-page-with-components"}) {
        seo {
          title
          description
        }
        body {
          fields {
            headline
            subheadline
            scroll_anchor_id
            button_label
            button_url
            image
            image_position
            testimonial {
              name
              quote
              title
            }
            features {
              description
              headline
              icon
            }
          }
          type
        }
      }
      allButterPage {
        nodes {
          slug
          page_type
          seo {
            title
            description
          }
          body {
            fields {
              headline
              subheadline
              scroll_anchor_id
              button_label
              button_url
              image
              image_position
              testimonial {
                name
                quote
                title
              }
              features {
                description
                headline
                icon
              }
            }
            type
          }
        }
      }
      allButterPost(
        limit: 2
        sort: {order: DESC, fields: published}
      ) {
        nodes {
          title
          summary
          slug
          featured_image
          featured_image_alt
        }
      }
    }
  `)

  const blogPageDataQuery = async (category, tag) => await graphql(`
    query {
      allButterPost(
        sort: {order: DESC, fields: published}
        filter: {
          ${category ? `categories: {elemMatch: {slug: {eq: \"${category}\"}}},` : ""}
          ${tag ? `tags: {elemMatch: {slug: {eq: \"${tag}\"}}},` : ""}
        }
      ) {
        nodes {
          title
          author {
            last_name
            first_name
            profile_image
          }
          summary
          body
          meta_description
          published(formatString: "ddd DD MMM YYYY")
          tags {
            name
            slug
          }
          url
          featured_image
          featured_image_alt
          slug
          categories {
            name
            slug
          }
        }
      }
    }
  `)

  const menuItemsData = await graphql(`
    query {
      butterCollection(key: {eq: "navigation_menu"}) {
        value {
          menu_items {
            label
            url
          }
        }
      }
    }
  `)

  const allBlogPosts = await blogPageDataQuery()

  // index
  createPage({
    path: `/`,
    component: require.resolve(`./src/templates/index.js`),
    context: {
      pageData: landingPage.data.butterPage,
      blogPosts: landingPage.data.allButterPost.nodes,
      menuData: menuItemsData
    },
  });

  // all pages for preview mode
  const allPages = landingPage.data.allButterPage.nodes
  allPages.filter(p => p.page_type !== "*").map(page => {
      return createPage({
        path: `${page.page_type}/${page.slug}`,
        component: require.resolve(`./src/templates/index.js`),
        context: {
          pageData: page,
          blogPosts: landingPage.data.allButterPost.nodes,
          menuData: menuItemsData
        },
      });
  })

  // blog index
  createPage({
    path: `/blog`,
    component: require.resolve(`./src/templates/blog.js`),
    context: {
      pageData: allBlogPosts,
      menuData: menuItemsData,
      categories,
      pageType: "blog"
    },
  });

  // search
  createPage({
    path: `/blog/search`,
    component: require.resolve(`./src/templates/blog.js`),
    context: {
      pageData: allBlogPosts,
      menuData: menuItemsData,
      categories,
      pageType: "search",
    },
  });

  // categories
  for (const category of categories) {
    const categoryPosts = await blogPageDataQuery(category.slug, null)
    createPage({
      path: `/blog/category/${category.slug}`,
      component: require.resolve(`./src/templates/blog.js`),
      context: {
        pageData: categoryPosts,
        menuData: menuItemsData,
        categories,
        pageType: "category",
        mainEntityName: category.name
      },
    });
  }

  // tags
  for (const tag of tags) {
    createPage({
      path: `/blog/tag/${tag.slug}`,
      component: require.resolve(`./src/templates/blog.js`),
      context: {
        pageData: await blogPageDataQuery(null, tag.slug),
        menuData: menuItemsData,
        categories,
        pageType: "tag",
        mainEntityName: tag.name
      },
    });
  }

  // blog posts
  allBlogPosts.data.allButterPost.nodes.map(article => {
    createPage({
      path: `/blog/${article.slug}`,
      component: require.resolve(`./src/templates/article.js`),
      context: {
        pageData: article,
        menuData: menuItemsData,
        categories
      },
    });
  })

}
