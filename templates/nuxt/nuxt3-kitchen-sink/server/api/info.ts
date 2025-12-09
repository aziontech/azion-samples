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
