module.exports = {
  seo: {
    title: "NextJSStore",
    description: "Fast Demo Store",
    titleTemplate: "%s | FastStore",
    author: "Store Framework",
  },
  theme: "custom-theme",
  platform: "vtex",
  api: {
    storeId: "storeframework",
    workspace: "master",
    environment: "vtexcommercestable",
    hideUnavailableItems: false,
    incrementAddress: false,
  },
  session: {
    currency: {
      code: "USD",
      symbol: "$",
    },
    locale: "en-US",
    channel: '{"salesChannel":"1","regionId":""}',
    country: "USA",
    deliveryMode: null,
    addressType: null,
    postalCode: null,
    geoCoordinates: null,
    person: null,
  },
  cart: {
    id: "",
    items: [],
    messages: [],
    shouldSplitItem: true,
  },
  storeUrl: "https://vtexfaststore.com",
  secureSubdomain: "https://secure.vtexfaststore.com",
  checkoutUrl: "https://secure.vtexfaststore.com/checkout",
  loginUrl: "https://secure.vtexfaststore.com/api/io/login",
  accountUrl: "https://secure.vtexfaststore.com/api/io/account",
  previewRedirects: {
    home: "/",
    plp: "/office",
    search: "/s?q=headphone",
    pdp: "/apple-magic-mouse/p",
  },
  lighthouse: {
    server: "http://localhost:3000",
    pages: {
      home: "/",
      pdp: "/apple-magic-mouse/p",
      collection: "/office",
    },
  },
  cypress: {
    pages: {
      home: "/",
      pdp: "/apple-magic-mouse/p",
      collection: "/office",
      collection_2: "/technology",
      collection_filtered:
        "/office/?category-1=office&marca=acer&facets=category-1%2Cmarca",
      search: "/s?q=orange",
    },
    browser: "electron",
  },
  analytics: {
    gtmContainerId: "GTM-PGHZ95N",
  },
  experimental: {
    cypressVersion: 12,
  },
  account: "storeframework",
  vtexHeadlessCms: {
    webhookUrls: [
      "https://storeframework.myvtex.com/cms-releases/webhook-releases",
    ],
  },
};
