import { error, Router } from "itty-router";

import { blockHTML } from "./lib/block.js";
import { mainHTML } from "./lib/main.js";
import { nonBlockHTML } from "./lib/non-block.js";

const jsonHeaders = {
    "content-type": "application/json",
};
const htmlHeaders = {
    "content-type": "text/html;charset=UTF-8",
};

/*
* @function blockIp
* @async
* @description This function proccess a request body to update the IP in the KV
* @param {Object} request - The request object
* @param {string} namespace - The KV namespace to use
*/
async function blockIp(request, namespace) {
    try {
        const body = await request.json();
        const ip = body.ip;
        const kv = await Azion.KV.open(namespace);
        await kv.put(
            request?.metadata?.remote_addr,
            Date.now() + 300000,
            { expirationTtl: 300 }
        );

        return new Response(`{"success": true}`, {
            headers: jsonHeaders,
            status: 200,
        });
    } catch (error) {
        console.error("Error while accessing KV", error.message);

        return new Response(`{"success": false}`, {
            headers: jsonHeaders,
            status: 500,
        });
    }
}

/*
* @function blockPage
* @async
* @description This function uses the KV to check if the IP is blocked, returning a custom page based on the result
* @param {Object} request - The request object
* @param {string} namespace - The KV namespace to use
*/
async function blockPage(request, namespace) {
    try {
        const kv = await Azion.KV.open(namespace);
        const blockedUntil = await kv.get(request?.metadata?.remote_addr);

        if (blockedUntil) {
            return new Response(blockHTML(blockedUntil), {
                headers: htmlHeaders,
                status: 403,
            });
        }
    } catch (error) {
        console.error("Error while accessing KV", error.message);
    }
    
    const html = nonBlockHTML();

    return new Response(html, {
        headers: htmlHeaders,
        status: 200,
    });
}

/*
* @function mainPage
* @async
* @description This function returns the main page of the application
* @param {Object} request - The request object
*/
async function mainPage(request) {
    const html = mainHTML(request?.metadata?.remote_addr);

    return new Response(html, {
        headers: htmlHeaders,
        status: 200,
    });
}

/*
* @function unblockIp
* @async
* @description This function removes the IP from the KV
* @param {Object} request - The request object
* @param {string} namespace - The KV namespace to use
*/
async function unblockIp(request, namespace) {
    try {
        const body = await request.json();
        const ip = body.ip;
        const kv = await Azion.KV.open(namespace);
        await kv.delete(ip);

        return new Response(`{"success": true}`, {
            headers: jsonHeaders,
            status: 200,
        });
    } catch (error) {
        console.error("Error while accessing KV", error.message);

        return new Response(`{"success": false}`, {
            headers: jsonHeaders,
            status: 500,
        });
    }
}

/* 
* @function main
* @description Main function that handles the request
* @param {Object} event - The incoming Cells event object
*/
function main(event) {
    const namespace = event?.args?.namespace || process.env.KV_STARTER_KIT_NAMESPACE;
    const mainRouter = Router();

    mainRouter.all("/am-i-blocked", (request) => blockPage(request, namespace));
    mainRouter.post("/block-ip", (request) => blockIp(request, namespace));
    mainRouter.post("/unblock-ip", (request) => unblockIp(request, namespace));
    mainRouter.all("/", mainPage);
    mainRouter.all("*", () => error(404));

    return mainRouter.fetch(event.request);
}

export default main;
