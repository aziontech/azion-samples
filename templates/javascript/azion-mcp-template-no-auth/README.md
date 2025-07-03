# Azion MCP Server Template

A Model Context Protocol (MCP) server deployed on Azion Edge Computing Network.

## Features

This MCP server provides:

A simple calculation tool that can add, subtract, multiply, and divide two numbers.

## Installation

### Prerequisites

- Azion CLI installed: [how to download](https://www.azion.com/en/documentation/products/azion-cli/overview/)

### Setup

1. Clone this repository
```bash
git clone https://github.com/your-username/azion-mcp-server.git
cd azion-mcp-server
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Build the server
```bash
azion build
```

## Usage

### Running the server

```bash
azion dev
```


### Integration with other MCP clients

For other MCP clients, follow their documentation for adding external MCP servers, providing the path to the built server file and the environment variables needed.

## Available Tools

- `calculator` - A simple calculator to sum, subtract, multiply and divide two numbers

## Development


### Extending the server

To add new Azion functionality:

1. Add new tools in `src/core/tools.ts`