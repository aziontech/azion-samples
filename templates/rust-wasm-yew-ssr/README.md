# Rust WASM Yew SSR

The Azion **Rust WASM Yew SSR** is designed to simplify and enhance the deployment process for Rust WASM Yew SSR applications directly on the edge of the network.

## Usage Information

- Install Rust [https://www.rust-lang.org/tools/install](https://www.rust-lang.org/tools/install)

Add target wasm32-unknown-unknown.

```bash

rustup target add wasm32-unknown-unknown

```

Install wasm bindgen cli. [https://crates.io/crates/wasm-bindgen-cli](https://crates.io/crates/wasm-bindgen-cli)

Execute:

```bash

cargo install -f wasm-bindgen-cli

```

To start using this template with **Vulcan**, you need to:

_Build Command_: To run the application build command

```bash

npx edge-functions@latest build

```

_Run local DEV_: To run the application locally with Vulcan

```bash

npx edge-functions@latest dev

```

