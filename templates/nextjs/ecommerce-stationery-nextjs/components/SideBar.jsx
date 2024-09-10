import React, { useEffect, useRef, useState } from "react";
import { CloseIcon, SearchIcon } from "./Icons";
import products from "../products.json";
import Image from "next/image";
import Link from "next/link";
import { data } from "../components/PanelExpand";

const SideBar = ({ sidebar, _sidebar, sidebartype }) => {
  useEffect(() => {
    const worker = (e) => {
      if (e.code == "Escape") _sidebar(false);
    };
    window.addEventListener("keydown", worker);
    return () => {
      window.removeEventListener("keydown", worker);
    };
  }, []);

  return (
    <div className={`sidebar ${sidebar ? "active" : ""}`}>
      {sidebartype == "search" ? (
        <SearchSideBar {...{ sidebar, _sidebar }} />
      ) : (
        <MenuSideBar _sidebar={_sidebar} />
      )}
    </div>
  );
};

const SearchSideBar = ({ sidebar, _sidebar }) => {
  const ref = useRef(null);

  useEffect(() => {
    _text("");
    ref.current?.focus();
  }, [sidebar]);

  const [text, _text] = useState("");
  return (
    <div className="searchsidebar">
      <div className="up">
        <h1>SEARCH</h1>
        <button onClick={() => _sidebar(null)}>
          <CloseIcon />
        </button>
      </div>
      <div className="input">
        <input
          type="text"
          ref={ref}
          autoFocus
          name="text"
          id="text"
          onChange={(e) => _text(e.target.value)}
          value={text}
        />
        <SearchIcon />
      </div>
      <ul>
        {text.trim().length > 0 &&
          products
            .filter((_) =>
              _.text.toLowerCase().includes(text.toLowerCase().trim())
            )
            .map((product) => {
              const { link, cover, subcategory, text, price } = product;
              return (
                <li>
                  <Link
                    onClick={() => _sidebar(null)}
                    href={`/collections/${subcategory}/${link}`}
                  >
                    <Image width={100} height={100} src={cover} />
                    <div className="t">
                      <p className="tt">{text}</p>
                      <p className="p">{price}</p>
                    </div>
                  </Link>
                </li>
              );
            })}
      </ul>
    </div>
  );
};

const MenuSideBar = ({ _sidebar }) => {
  const q = [
    "Shop All",
    "Paper & Planners",
    "Desk Supplies",
    "Home Decor",
    "Apparel & Accessories",
  ];
  const [s, _s] = useState([]);
  const exp = (src) => {
    const ie = s.includes(src);
    if (ie) _s(s.filter((_) => _ != src));
    else _s([...s, src]);
  };
  return (
    <div className="menusidebar">
      <div className="up">
        <p>Menu</p>
        <button onClick={() => _sidebar(false)}>
          <CloseIcon />
        </button>
      </div>
      <ul>
        {q.map((src, index) => {
          return (
            <ul>
              <h1 onClick={() => exp(src)}>{src}</h1>
              <div className={`views ${src} ${s.includes(src) && "active"}`}>
                {data[Object.keys(data)[index]].map((_) => {
                  return (
                    <li onClick={() => _sidebar(false)}>
                      <Link href={`/collections/${_.link}`}>{_.text}</Link>
                    </li>
                  );
                })}
              </div>
            </ul>
          );
        })}
      </ul>
    </div>
  );
};

export default SideBar;
