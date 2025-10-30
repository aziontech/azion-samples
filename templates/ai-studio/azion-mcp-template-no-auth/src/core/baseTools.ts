import { z } from "zod";
import { McpTool } from "@/types";

/**
 * Creates a base tool
 * @param {string} name The name of the tool
 * @param {string} description The description of the tool
 * @returns The tool
 */
export function createCalculatorTool(
    name: string,
    description: string,
): McpTool {
    return {
        name,
        description,
        inputSchema: {
            a: z.string().describe("Number A"),
            b: z.number().describe("Number B"),
            operation: z.enum(["add", "subtract", "multiply", "divide"]).describe("Operation between A and B: add, subtract, multiply, divide")
        },
        execute: async (args: Record<string, any>) => {

            const { a, b, operation } = args;

            let result = 0
            switch (operation) {
                case "add":
                    result = a + b
                    break;
                case "subtract":
                    result = a - b
                    break;
                case "multiply":
                    result = a * b
                    break;
                case "divide":
                    result = a / b
                    break;
            }

            return {
                content: [
                    {
                        type: "text",
                        text: result.toString()
                    }
                ]
            };
        }
    }
}