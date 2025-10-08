import { createListHttpEventsTool, createListNetworkListTool, createCreateNetworkListTool, createGetNetworkListTool, createUpdateNetworkListTool } from "./baseTools";

export const tools = [
    createListHttpEventsTool(
        "query_http_events",
        `Queries Azion Real-Time Events GraphQL to list HTTP events in a given time range.
        Inputs (all optional):
            - begin: ISO 8601 UTC start datetime (defaults to now-5min)
            - end: ISO 8601 UTC end datetime (defaults to now)

        Authorization:
            - Set AZION_API_TOKEN (or AZION_TOKEN) in your environment/.env

        Example question:
            "List the latest HTTP events for my application."
        `,
    ),
    createListNetworkListTool(
        "list_network_lists",
        `Lists Azion Network Lists of type ip_cidr. Always filters by ip_cidr type.

        Authorization:
            - Set AZION_API_TOKEN (or AZION_TOKEN) in your environment/.env

        Example question:
            "List all my IP CIDR network lists."
        `,
    ),
    createCreateNetworkListTool(
        "create_network_list",
        `Creates an Azion Network List.
        Inputs:
            - name: The name of the network list.
            - type: The type of the network list (ip_cidr, asn, countries).
            - items: An array of items for the network list.
            - active (optional): Whether the network list is active. Defaults to true.

        Authorization:
            - Set AZION_API_TOKEN (or AZION_TOKEN) in your environment/.env

        Example question:
            "Create a new network list named 'My IP Blocklist' of type 'ip_cidr' with the items '192.168.1.1/32' and '10.0.0.0/8'."
        `,
    ),
    createGetNetworkListTool(
        "get_network_list",
        `Retrieves a specific Azion Network List by ID and optionally checks if an IP exists in it.
        Inputs:
            - networkListId: The ID of the network list to retrieve (e.g., 48334).
            - checkIp (optional): IP address to check if it exists in the network list items.

        Authorization:
            - Set AZION_API_TOKEN (or AZION_TOKEN) in your environment/.env

        Example questions:
            "Get network list 48334"
            "Check if IP 192.168.1.100 exists in network list 48334"
        `,
    ),
    createUpdateNetworkListTool(
        "update_network_list",
        `Updates an Azion Network List by adding new IP addresses or replacing all items.
        Inputs:
            - networkListId: The ID of the network list to update.
            - newItems: Array of new IP addresses/CIDR blocks to add.
            - replaceAll (optional): If true, replaces all items. If false (default), adds to existing items.

        Authorization:
            - Set AZION_API_TOKEN (or AZION_TOKEN) in your environment/.env

        Example questions:
            "Add IP 192.168.1.200 to network list 48334"
            "Update network list 48334 with IPs ['10.0.0.1', '172.16.0.1']"
        `,
    ),
];