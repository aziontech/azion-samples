import { createCalculatorTool } from "./baseTools";

export const tools = [
    createCalculatorTool(
        "calculator",
        `Performs a calculation between two numbers.
        Usage:
            - Inform the first number (A)
            - Inform the second number (B)
            - Inform the operation (add, subtract, multiply, divide)
        `,
    )
];