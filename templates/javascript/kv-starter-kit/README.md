# KV Starter Kit

This template showcases how to use Azion KV.

In the `index.js` file, you can find examples of how to use basic commands of the Azion KV API, such as:
- Setting a key-value pair, with a TTL (time to live)
- Getting a value by key
- Deleting a key-value pair (which is entirely optional. as we're setting a TTL to expire the values automatically)

This templates uses the [Azion TypeScript Library](https://github.com/aziontech/lib) as well as the [Itty Router](https://itty.dev/) for routing.

## How to deploy this application to Azion
1. Create a new KV namespace in the Azion Console
2. Set the namespace name in the `KV_STARTER_KIT_NAMESPACE` environment variable
3. Link and deploy the template using the  Azion CLI: `azion link`

Or, just use the Azion Console to deploy the template, by hitting the button bellow:

[![Deploy Button](https://www.azion.com/button.svg)](https://console.azion.com/create/azion/kv-starter-kit "Deploy with Azion")