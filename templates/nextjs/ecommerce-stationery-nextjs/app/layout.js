"use client";

import Footer from "@/components/Footer";
import "./globals.scss";
import { Montserrat } from "next/font/google";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { createContext, useContext, useEffect, useState } from "react";

const inter = Montserrat({ subsets: ["latin"] });

const Context = createContext();

export const runtime = "edge";

export const GetContext = () => useContext(Context);
const ContextProvider = (props) => {
  const [data, _data] = useState([]);
  const [n, _n] = useState(false);
  const [xd, _xd] = useState(false);
  const [favoritespopup, _favoritespopup] = useState(false);

  const value = {
    data,
    _data,
    n,
    _n,
    favoritespopup,
    _favoritespopup,
    xd,
    _xd,
  };

  useEffect(() => {
    try {
      const a = window.localStorage.getItem("data") || [];
      const b = JSON.parse(a);
      _data(b);
    } catch (error) {
      window.localStorage.setItem("data", JSON.stringify([]));
    }
  }, []);

  return <Context.Provider value={value}>{props.children}</Context.Provider>;
};

export default function RootLayout({ children }) {
  const [sidebar, _sidebar] = useState(null);
  const [sidebartype, _sidebartype] = useState(null);
  useEffect(() => {
    document.querySelector("body").style.overflow = sidebar ? "hidden" : "auto";
  }, [sidebar]);

  return (
    <html lang="en">
      <head>
        <meta
          name="description"
          content="We design the best stationery and carry a curated collection of housewares, apparel, and accessories. Free shipping over $50."
        />
        <title>Poketo | Art & Design For Your Every Day</title>
      </head>
      <body className={inter.className}>
        <ContextProvider>
          <div className={`wrapper ${sidebar ? "active" : ""}`}>
            <Header {...{ sidebar, _sidebar, _sidebartype }} />
            {children}
            <Footer />
          </div>
          <SideBar {...{ sidebar, _sidebar, sidebartype }} />
        </ContextProvider>
      </body>
    </html>
  );
}
