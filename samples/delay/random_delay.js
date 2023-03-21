async function firewallHandler(event) {
  await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 10000)));
  event.continue();
}

async function fetchHandler() {
  await new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * 10000)));
  return new Response("It works!", {
    headers: {"content-type": "plain/text"},
    status: 200
  });
}

addEventListener("firewall", (event) => event.waitUntil(firewallHandler(event)));

addEventListener("fetch", event => {return event.respondWith(fetchHandler())});

