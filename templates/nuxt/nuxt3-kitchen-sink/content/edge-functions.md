# Edge Functions

Edge Functions allow you to deliver content to your site's visitors with speed and personalization. They are deployed globally on Azion's Edge Network and enable you to move server-side logic to the Edge, close to your visitors.

#### `/server/api/info.ts`

```ts
export default eventHandler((event) => {
  const ipHeader = event.req.headers['x-forwarded-for'] as string;
  const ip = ipHeader ? ipHeader.split(',')[0] : '-';
  const userAgentHeader = event.req.headers['user-agent'] as string;
  const ua = userAgentHeader ? decodeURIComponent(userAgentHeader) : '-';

  return {
    ip,
    ua,
  };
});

```

## Result

:EdgeDemo