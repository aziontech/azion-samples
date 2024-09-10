import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Nav from "../components/Nav";
import { CartContext, useCartState } from "@/hooks/useCart";

export default function App({ Component, pageProps }: AppProps) {
  const cart = useCartState()
  return (
    <>
      <CartContext.Provider value={cart}>
        <Nav  /> <Component {...pageProps} />
      </CartContext.Provider>
    </>
  );
}
