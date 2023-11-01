Environment Variables
---

This sample show how to work with Environment Variables in an Azion Cells's Edge Function.

It's pretty straightforward, all you have to do is to call the method `Azion.env.get`, sending as argument the name of the environment variable from whose you want to retrieve the value.

For example: `Azion.env.get('HELLO_WORLD_EDGE_FUNCTION')`.

In this example, whenever the variable `HELLO_WORLD_EDGE_FUNCTION` has a value, the method `Azion.env.get` would return the value. Otherwise, the method would return an `undefined` value.



Running this sample
---

This sample show cases how to use Environment Variables as a fallback for undefined JSON Arguments.

So, for example, let's say the JSON Args for our sample Edge Function Instance is empty: `{}`.

If we call our Edge Function, we'd receive the text `Hello World`, because neither the JSON Args `message` key, nor the Environment variable `HELLO_WORLD_EDGE_FUNCTION` have a valid value.

So, if we set a value for our Environment Variable:

```
curl -X POST https://api.azionapi.net/variables \
    -H 'Accept: application/json; version=3' \
    -H 'Authorization: token [YOUR_TOKEN]' \
    -H 'Content-Type: application/json' \
    -d '{
      "key": "HELLO_WORLD_EDGE_FUNCTION",
      "value": "Hello World using Environment Variables!"
    }'
```

By calling our Edge Function, now we'd receive the message `Hello World using Environment Variables!`.
    
Finally, if for example, we set our Edge Function Instance's JSON Args to  `{"message": "Hello World using JSON Args!"}`. By calling the Edge Function, we'd receive the message `Hello World using JSON Args!`, because in this example, the Environment Variable is being used just as a fallback for JSON Args.

This showcases how we can use the Environment Variables for scenarios where we want to define a more generic value for multiple Edge Function Instances, but want to be able to set more specific values in just a few Edge Function Instances, while still being able to quickly modify the generic value without having the change the Edge Function's code (in opposition to hard-coding a default value) and also being able to use this very same "default value" in multiple different Edge Functions.

For more information about Azion's Environment Variables, please visit the [Azion Docs](https://www.azion.com/en/documentation/products/edge-functions/environment-variables/) and/or the [Azion API Reference](https://api.azion.com/#a9f1a8aa-bacc-48f0-8d4b-903a412790c4).