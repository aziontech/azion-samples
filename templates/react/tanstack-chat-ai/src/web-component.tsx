import { createRoot, type Root } from "react-dom/client";
import { Chat } from "./components/Chat";

const RESET_CSS = `
  :host {
    display: block;
    width: 100%;
    height: 100%;
    contain: content;
  }
  * {
    box-sizing: border-box;
  }
  .azion-chat-widget-root {
    height: 100%;
    font-family: 'Sora', system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
  }
  .azion-chat-widget-root ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }
  .azion-chat-widget-root ::-webkit-scrollbar-track {
    background: transparent;
  }
  .azion-chat-widget-root ::-webkit-scrollbar-thumb {
    background: #353040;
    border-radius: 4px;
  }
  .azion-chat-widget-root ::-webkit-scrollbar-thumb:hover {
    background: #524BBB;
  }
`;

class AzionChatWidget extends HTMLElement {
  static observedAttributes = ["api-url"];

  #root: Root | null = null;
  #mountPoint: HTMLDivElement | null = null;

  connectedCallback() {
    if (this.#root) return;

    const shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = RESET_CSS;
    shadow.appendChild(style);

    this.#mountPoint = document.createElement("div");
    this.#mountPoint.className = "azion-chat-widget-root";
    shadow.appendChild(this.#mountPoint);

    this.#root = createRoot(this.#mountPoint);
    this.#render();
  }

  disconnectedCallback() {
    this.#root?.unmount();
    this.#root = null;
    this.#mountPoint = null;
  }

  attributeChangedCallback() {
    this.#render();
  }

  #render() {
    if (!this.#root) return;
    const apiUrl = this.getAttribute("api-url") ?? undefined;
    this.#root.render(<Chat apiUrl={apiUrl} />);
  }
}

if (!customElements.get("azion-chat-widget")) {
  customElements.define("azion-chat-widget", AzionChatWidget);
}

export { AzionChatWidget };
