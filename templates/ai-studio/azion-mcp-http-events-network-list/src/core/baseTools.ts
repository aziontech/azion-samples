import { z } from "zod";
import { McpTool } from "@/types";

/**
 * Creates a tool to query Azion Real-Time Events GraphQL for HTTP events.
 * It retrieves a list of HTTP events within a specified time range.
 *
 * Env:
 *  - AZION_API_TOKEN (preferred) or AZION_TOKEN: API token to use in Authorization header.
 */
export function createListHttpEventsTool(
    name: string,
    description: string,
): McpTool {
    return {
        name,
        description,
        inputSchema: {
            begin: z.string().optional().describe("ISO 8601 UTC start datetime. Defaults to now-5min"),
            end: z.string().optional().describe("ISO 8601 UTC end datetime. Defaults to now"),
        },
        execute: async (args: Record<string, any>) => {
            const now = new Date();
            const defaultEnd = now.toISOString();
            const defaultBegin = new Date(now.getTime() - 5 * 60 * 1000).toISOString();

            const begin: string = (args?.begin as string) ?? defaultBegin;
            const end: string = (args?.end as string) ?? defaultEnd;

            const token = process.env.AZION_API_TOKEN || process.env.AZION_TOKEN ;
            if (!token) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Missing AZION_API_TOKEN (or AZION_TOKEN) in environment. Please create a .env with AZION_API_TOKEN=your_token and ensure your runner loads it.",
                        },
                    ],
                };
            }
        
            const BASE_URL = "https://api-origin.azionapi.net/events/graphql";

            const fetchFn = (globalThis as any)?.fetch?.bind(globalThis);
            if (typeof fetchFn !== 'function') {
                return {
                    content: [
                        { type: 'text', text: 'Fetch API is not available in this runtime. Please run on Node 18+ or provide a fetch polyfill.' },
                    ],
                };
            }

            const query = `
query httpEvents($tsRange_begin: DateTime!, $tsRange_end: DateTime!) {
	httpEvents (
		limit: 1000
		orderBy: [ts_DESC]
		filter: {
			tsRange: { begin: $tsRange_begin, end: $tsRange_end }
		}
	) {
    ts
		configurationId
		host
		requestId
		httpUserAgent
		requestMethod
		status
		upstreamBytesSent
    upstreamCacheStatus
		sslProtocol
		wafLearning
		requestTime
		serverProtocol
    upstreamAddr
		httpReferer
		remoteAddress
		wafMatch
    wafScore
    wafBlock
		serverPort
		sslCipher
		serverAddr
		scheme
    geolocAsn
    geolocRegionName
    geolocCountryName
	}
}
`;

            const variables = {
                tsRange_begin: begin,
                tsRange_end: end,
            };

            const res = await fetchFn(BASE_URL, {
                method: 'POST',
                headers: {
                    'content-type': 'application/json',
                    'authorization': `Token ${token}`,
                },
                body: JSON.stringify({ query, variables }),
            });

            const json = await res.json().catch(() => ({ errors: [{ message: 'Invalid JSON response from Azion API' }] }));

            if (!res.ok) {
                const message = (json && json.errors && Array.isArray(json.errors) && json.errors[0]?.message)
                    ? json.errors[0].message
                    : `HTTP ${res.status} ${res.statusText}`;
                return {
                    content: [
                        { type: 'text', text: `Azion GraphQL request failed: ${message}` },
                    ],
                };
            }

            const HttpEventSchema = z.object({
                ts: z.string(),
                configurationId: z.string().nullable().optional(),
                host: z.string().nullable().optional(),
                requestId: z.string().nullable().optional(),
                httpUserAgent: z.string().nullable().optional(),
                requestMethod: z.string().nullable().optional(),
                status: z.number().nullable().optional(),
                upstreamBytesSent: z.number().nullable().optional(),
                upstreamCacheStatus: z.string().nullable().optional(),
                sslProtocol: z.string().nullable().optional(),
                wafLearning: z.string().nullable().optional(),
                requestTime: z.string().nullable().optional(),
                serverProtocol: z.string().nullable().optional(),
                upstreamAddr: z.string().nullable().optional(),
                httpReferer: z.string().nullable().optional(),
                remoteAddress: z.string().nullable().optional(),
                wafMatch: z.string().nullable().optional(),
                wafScore: z.string().nullable().optional(),
                wafBlock: z.string().nullable().optional(),
                serverPort: z.string().nullable().optional(),
                sslCipher: z.string().nullable().optional(),
                serverAddr: z.string().nullable().optional(),
                scheme: z.string().nullable().optional(),
                geolocAsn: z.string().nullable().optional(),
                geolocRegionName: z.string().nullable().optional(),
                geolocCountryName: z.string().nullable().optional(),
            });

            const ResponseSchema = z.object({
                data: z.object({
                    httpEvents: z.array(HttpEventSchema),
                }),
            });

            const parsed = ResponseSchema.safeParse(json);

            if (!parsed.success) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Unexpected response format from Azion API: ${parsed.error.message}`,
                        },
                    ],
                };
            }

            const events = parsed.data.data.httpEvents;

            const header = `HTTP Events from ${begin} to ${end}`;
            const prettyJson = JSON.stringify(events, null, 2);

            return {
                content: [
                    {
                        type: 'text',
                        text: `${header}\n\nRaw data:\n${prettyJson}`,
                    },
                ],
            };
        },
    };
}

/**
 * Creates a tool to list Azion Network Lists of type ip_cidr.
 * Always filters by ip_cidr type.
 *
 * Env:
 *  - AZION_API_TOKEN (preferred) or AZION_TOKEN: API token to use in Authorization header.
 */
export function createListNetworkListTool(
    name: string,
    description: string,
): McpTool {
    return {
        name,
        description,
        inputSchema: {},
        execute: async (args: Record<string, any>) => {
            const token = process.env.AZION_API_TOKEN || process.env.AZION_TOKEN;
            if (!token) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Missing AZION_API_TOKEN (or AZION_TOKEN) in environment. Please create a .env with AZION_API_TOKEN=your_token and ensure your runner loads it.",
                        },
                    ],
                };
            }

            const BASE_URL = "https://edge-api.azion.net/workspace/api/network_lists";
            const url = new URL(BASE_URL);
            // Always filter by ip_cidr type
            url.searchParams.append('type', 'ip_cidr');

            const fetchFn = (globalThis as any)?.fetch?.bind(globalThis);
            if (typeof fetchFn !== 'function') {
                return {
                    content: [
                        { type: 'text', text: 'Fetch API is not available in this runtime. Please run on Node 18+ or provide a fetch polyfill.' },
                    ],
                };
            }

            const res = await fetchFn(url.toString(), {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });

            const json = await res.json().catch(() => ({ message: 'Invalid JSON response from Azion API {status: ' + res.status + '}'}));

            if (!res.ok) {
                const message = json.message || `HTTP ${res.status} ${res.statusText}`;
                return {
                    content: [
                        { type: 'text', text: `Azion API request failed: ${message}` },
                    ],
                };
            }

            const NetworkListSchema = z.object({
                id: z.number(),
                name: z.string(),
                type: z.string(),
                last_editor: z.string(),
                last_modified: z.string(),
                active: z.boolean(),
            });

            const ResponseSchema = z.object({
                count: z.number(),
                results: z.array(NetworkListSchema),
            });

            const parsed = ResponseSchema.safeParse(json);

            if (!parsed.success) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Unexpected response format from Azion API: ${parsed.error.message}`,
                        },
                    ],
                };
            }

            const prettyJson = JSON.stringify(parsed.data.results, null, 2);

            return {
                content: [
                    {
                        type: 'text',
                        text: `Found ${parsed.data.count} network lists.\n\n${prettyJson}`,
                    },
                ],
            };
        },
    };
}

/**
 * Creates a tool to retrieve a specific Azion Network List by ID.
 * Checks if a given IP is present in the network list items.
 *
 * Env:
 *  - AZION_API_TOKEN (preferred) or AZION_TOKEN: API token to use in Authorization header.
 */
export function createGetNetworkListTool(
    name: string,
    description: string,
): McpTool {
    return {
        name,
        description,
        inputSchema: {
            networkListId: z.number().describe("The ID of the network list to retrieve."),
            checkIp: z.string().optional().describe("Optional IP address to check if it exists in the network list items."),
        },
        execute: async (args: Record<string, any>) => {
            const token = process.env.AZION_API_TOKEN || process.env.AZION_TOKEN;
            if (!token) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Missing AZION_API_TOKEN (or AZION_TOKEN) in environment. Please create a .env with AZION_API_TOKEN=your_token and ensure your runner loads it.",
                        },
                    ],
                };
            }

            const BASE_URL = `https://edge-api.azion.net/workspace/api/network_lists/${args.networkListId}`;

            const fetchFn = (globalThis as any)?.fetch?.bind(globalThis);
            if (typeof fetchFn !== 'function') {
                return {
                    content: [
                        { type: 'text', text: 'Fetch API is not available in this runtime. Please run on Node 18+ or provide a fetch polyfill.' },
                    ],
                };
            }

            const res = await fetchFn(BASE_URL, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Token ${token}`,
                },
            });

            const json = await res.json().catch(() => ({ message: 'Invalid JSON response from Azion API' }));

            if (!res.ok) {
                const message = json.message || `HTTP ${res.status} ${res.statusText}`;
                return {
                    content: [
                        { type: 'text', text: `Azion API request failed: ${message}` },
                    ],
                };
            }

            const NetworkListSchema = z.object({
                data: z.object({
                    id: z.number(),
                    name: z.string(),
                    type: z.string(),
                    items: z.array(z.string()),
                    last_editor: z.string(),
                    last_modified: z.string(),
                    active: z.boolean(),
                }),
            });

            const parsed = NetworkListSchema.safeParse(json);

            if (!parsed.success) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Unexpected response format from Azion API: ${parsed.error.message}`,
                        },
                    ],
                };
            }

            const networkList = parsed.data.data;
            let ipCheckResult = "";

            // Check if IP is provided and exists in the network list
            if (args.checkIp) {
                const ipExists = networkList.items.includes(args.checkIp);
                ipCheckResult = `\n\nIP Check: ${args.checkIp} ${ipExists ? 'is already present' : 'is NOT present'} in the network list.`;
            }

            const prettyJson = JSON.stringify(networkList, null, 2);

            return {
                content: [
                    {
                        type: 'text',
                        text: `Network List Details (ID: ${networkList.id}):\n\n${prettyJson}${ipCheckResult}`,
                    },
                ],
            };
        },
    };
}

/**
 * Creates a tool to update an Azion Network List by adding new IP addresses.
 * This tool patches the network list with new items, preserving existing ones.
 *
 * Env:
 *  - AZION_API_TOKEN (preferred) or AZION_TOKEN: API token to use in Authorization header.
 */
export function createUpdateNetworkListTool(
    name: string,
    description: string,
): McpTool {
    return {
        name,
        description,
        inputSchema: {
            networkListId: z.number().describe("The ID of the network list to update."),
            newItems: z.array(z.string()).describe("Array of new IP addresses/CIDR blocks to add to the network list."),
            replaceAll: z.boolean().optional().describe("If true, replaces all items. If false (default), adds to existing items."),
        },
        execute: async (args: Record<string, any>) => {
            const token = process.env.AZION_API_TOKEN || process.env.AZION_TOKEN;
            if (!token) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Missing AZION_API_TOKEN (or AZION_TOKEN) in environment. Please create a .env with AZION_API_TOKEN=your_token and ensure your runner loads it.",
                        },
                    ],
                };
            }

            const BASE_URL = `https://edge-api.azion.net/workspace/api/network_lists/${args.networkListId}`;

            const fetchFn = (globalThis as any)?.fetch?.bind(globalThis);
            if (typeof fetchFn !== 'function') {
                return {
                    content: [
                        { type: 'text', text: 'Fetch API is not available in this runtime. Please run on Node 18+ or provide a fetch polyfill.' },
                    ],
                };
            }

            let finalItems = args.newItems;

            // If not replacing all, we need to get current items first
            if (!args.replaceAll) {
                const getRes = await fetchFn(BASE_URL, {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json',
                        'Authorization': `Token ${token}`,
                    },
                });

                if (getRes.ok) {
                    const currentData = await getRes.json().catch(() => ({}));
                    if (currentData.data && currentData.data.items) {
                        // Merge existing items with new ones, removing duplicates
                        const existingItems = currentData.data.items;
                        const combinedItems = [...existingItems, ...args.newItems];
                        finalItems = [...new Set(combinedItems)]; // Remove duplicates
                    }
                }
            }

            const body = {
                items: finalItems,
            };

            const res = await fetchFn(BASE_URL, {
                method: 'PATCH',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(body),
            });

            const json = await res.json().catch(() => ({ message: 'Invalid JSON response from Azion API' }));

            if (!res.ok) {
                const message = json.message || `HTTP ${res.status} ${res.statusText}`;
                return {
                    content: [
                        { type: 'text', text: `Azion API request failed: ${message}` },
                    ],
                };
            }

            const ResponseSchema = z.object({
                state: z.string(),
                data: z.object({
                    id: z.number(),
                    name: z.string(),
                    type: z.string(),
                    items: z.array(z.string()),
                    last_editor: z.string(),
                    last_modified: z.string(),
                    active: z.boolean(),
                }),
            });

            const parsed = ResponseSchema.safeParse(json);

            if (!parsed.success) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Unexpected response format from Azion API: ${parsed.error.message}`,
                        },
                    ],
                };
            }

            const prettyJson = JSON.stringify(parsed.data.data, null, 2);

            return {
                content: [
                    {
                        type: 'text',
                        text: `Successfully updated network list (State: ${parsed.data.state}).\n\n${prettyJson}`,
                    },
                ],
            };
        },
    };
}

/**
 * Creates a tool to create an Azion Network List.
 *
 * Env:
 *  - AZION_API_TOKEN (preferred) or AZION_TOKEN: API token to use in Authorization header.
 */
export function createCreateNetworkListTool(
    name: string,
    description: string,
): McpTool {
    return {
        name,
        description,
        inputSchema: {
            name: z.string().describe("The name of the network list."),
            type: z.enum(["ip_cidr", "asn", "countries"]).describe("The type of the network list."),
            items: z.array(z.string()).describe("The items of the network list."),
            active: z.boolean().optional().describe("Whether the network list is active. Defaults to true."),
        },
        execute: async (args: Record<string, any>) => {
            const token = process.env.AZION_API_TOKEN || process.env.AZION_TOKEN;
            if (!token) {
                return {
                    content: [
                        {
                            type: "text",
                            text: "Missing AZION_API_TOKEN (or AZION_TOKEN) in environment. Please create a .env with AZION_API_TOKEN=your_token and ensure your runner loads it.",
                        },
                    ],
                };
            }

            const BASE_URL = "https://edge-api.azion.net/workspace/api/network_lists";

            const fetchFn = (globalThis as any)?.fetch?.bind(globalThis);
            if (typeof fetchFn !== 'function') {
                return {
                    content: [
                        { type: 'text', text: 'Fetch API is not available in this runtime. Please run on Node 18+ or provide a fetch polyfill.' },
                    ],
                };
            }
            
            const body = {
                name: args.name,
                type: args.type,
                items: args.items,
                active: args.active ?? true,
            };

            const res = await fetchFn(BASE_URL, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify(body),
            });

            const json = await res.json().catch(() => ({ message: 'Invalid JSON response from Azion API' }));

            if (!res.ok) {
                const message = json.message || `HTTP ${res.status} ${res.statusText}`;
                return {
                    content: [
                        { type: 'text', text: `Azion API request failed: ${message}` },
                    ],
                };
            }

            const ResponseSchema = z.object({
                state: z.string(),
                data: z.object({
                    id: z.number(),
                    name: z.string(),
                    type: z.string(),
                    items: z.array(z.string()),
                    last_editor: z.string(),
                    last_modified: z.string(),
                    active: z.boolean(),
                }),
            });

            const parsed = ResponseSchema.safeParse(json);

            if (!parsed.success) {
                return {
                    content: [
                        {
                            type: 'text',
                            text: `Unexpected response format from Azion API: ${parsed.error.message}`,
                        },
                    ],
                };
            }

            const prettyJson = JSON.stringify(parsed.data.data, null, 2);

            return {
                content: [
                    {
                        type: 'text',
                        text: `Successfully created network list.\n\n${prettyJson}`,
                    },
                ],
            };
        },
    };
}