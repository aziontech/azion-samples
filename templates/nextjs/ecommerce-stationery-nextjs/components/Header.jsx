"use client";

import React, { createRef, useEffect, useRef, useState } from "react";
import PanelExpand from "./PanelExpand";
import Link from "next/link";
import Image from "next/image";
import { SearchIcon, CartIcon, FavoritesIcon } from "./Icons";
import FavoritesPopup from "./FavoritesPopup";
import NotificationPopup from "./NotificationPopup";
import { GetContext } from "@/app/layout";

const Header = ({ sidebar, _sidebar, _sidebartype }) => {
  const { favoritespopup, _favoritespopup, data } = GetContext();
  const setter = (value) => {
    if (panel && panel != value) {
      _panel(null);
      setTimeout(() => _panel(value), 150);
    } else {
      _panel(value);
    }
  };
  const closex = () => {
    _sidebar(false);
    _panel(null);
    setTimeout(() => {
      _panel(null);
    }, 0);
  };
  const [panel, _panel] = useState(null);
  const [h, _h] = useState(null);
  const ref = createRef(0);
  const [s, _s] = useState("up");
  const [c, _c] = useState("c");

  useEffect(() => {
    const worker = () => {
      _s(window.scrollY > ref.current ? "down" : "up");
      _c(window.scrollY == 0 ? "c" : "");
      ref.current = window.scrollY;
    };

    window.addEventListener("scroll", worker);
    return () => {
      window.removeEventListener("scroll", worker);
    };
  }, []);

  const openFav = () => _favoritespopup(true);
  const closeFav = () => _favoritespopup(false);
  return (
    <>
      <NotificationPopup {...{ openFav, closeFav }} />
      <div className={`header ${c} ${s}`}>
        <div className="upside">
          <Link
            onClick={closex}
            href={"/collections/crow-canyon-home-collection"}
          >
            NEW limited edition Poketo x Crow Canyon Home Collection is here!
            Shop Now
          </Link>
        </div>
        <div className={`downside`}>
          <Link onClick={closex} href={"/"}>
            <Image
              alt="logo"
              width={194}
              height={40}
              src={"/Poketo-Logo-Site.png"}
            />
          </Link>
          <div className="right">
            <ul className="nav">
              <li
                onMouseEnter={() => setter("shopall")}
                onMouseLeave={() => _panel(null)}
                className={panel == "shopall" ? "active" : ""}
              >
                <Link onClick={closex} href={"/collections/shop-all"}>
                  Shop All
                </Link>
              </li>
              <li
                onMouseEnter={() => setter("stationery")}
                onMouseLeave={() => _panel(null)}
                className={panel == "stationery" ? "active" : ""}
              >
                <Link onClick={closex} href={"/collections/stationery"}>
                  Paper & Planners
                </Link>
              </li>
              <li
                onMouseEnter={() => setter("supplies")}
                onMouseLeave={() => _panel(null)}
                className={panel == "supplies" ? "active" : ""}
              >
                <Link onClick={closex} href={"/collections/supplies"}>
                  Desk Supplies
                </Link>
              </li>
              <li
                onMouseEnter={() => setter("living")}
                onMouseLeave={() => _panel(null)}
                className={panel == "living" ? "active" : ""}
              >
                <Link onClick={closex} href={"/collections/living"}>
                  Home Decor
                </Link>
              </li>
              <li
                onMouseEnter={() => setter("accessories")}
                onMouseLeave={() => _panel(null)}
                className={panel == "accessories" ? "active" : ""}
              >
                <Link onClick={closex} href={"/collections/accessories"}>
                  Apparel & Accessories
                </Link>
              </li>
            </ul>
            <div
              className={`search ${sidebar ? "disabled" : ""}`}
              onClick={() => {
                _sidebar(true);
                _sidebartype("search");
              }}
            >
              <SearchIcon />
            </div>
            <Link
              onClick={closex}
              href={"/cart"}
              className={`cart ${h == true ? "e" : h == false ? "l" : ""} ${
                sidebar && "disabled"
              }`}
              onMouseLeave={() => _h(false)}
              onMouseEnter={() => _h(true)}
            >
              <CartIcon />
              <span>
                <p>{data.filter((_) => _.type == "cart").length}</p>
              </span>
            </Link>
            <div onClick={() => _favoritespopup(true)} className="favorites">
              <FavoritesIcon />
            </div>
            <button
              className={`menubtn ${sidebar ? "disabled" : ""}`}
              onClick={() => {
                _sidebar(true);
                _sidebartype("menu");
              }}
            >
              <div className="box">
                <div className="line f"></div>
                <div className="line"></div>
                <div className="line l"></div>
              </div>
            </button>
            <PanelExpand {...{ panel, _panel, closex }} />
          </div>
        </div>
      </div>
      <div
        onClick={() => _sidebar(false)}
        className={`black-layer ${sidebar || panel ? "active" : ""}`}
      ></div>
      {favoritespopup && <FavoritesPopup closeFav={closeFav} />}
    </>
  );
};

export default Header;
