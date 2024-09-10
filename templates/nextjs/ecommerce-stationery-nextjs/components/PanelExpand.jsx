"use client";
import Link from "next/link";
import React, { useEffect, useRef } from "react";

export const data = {
  shopall: [
    { text: "Shop All", link: "/shop-all", category: "shop-all" },
    {
      text: "New Arrivals",
      link: "/new",
      category: "shop-all",
      cover:
        "https://cdn.shopify.com/s/files/1/0001/5211/collections/New-Category-Banner_0706e77e-f7e0-4258-930b-3575abb52106_2400x.jpg?v=1631223642",
    },
    {
      text: "Best Sellers",
      link: "/best-sellers",
      category: "shop-all",
      cover:
        "https://cdn.shopify.com/s/files/1/0001/5211/collections/BestSellers-Category-Banner_2400x.jpg?v=1607034510",
    },
    { text: "Gift Guide", link: "/shop-all-gifts", category: "shop-all" },
  ],
  stationery: [
    {
      text: "All Stationery",
      link: "/stationery",
      category: "stationery",
      cover:
        "https://cdn.shopify.com/s/files/1/0001/5211/collections/Stationery-Category-Banner_2400x.jpg?v=1672866618",
    },
    {
      text: "Calendars & Planners",
      link: "/planners",
      category: "stationery",
      cover:
        "https://cdn.shopify.com/s/files/1/0001/5211/collections/Planners-Category-Banner_2400x.jpg?v=1672866618",
    },
    {
      text: "Greeting Cards & Gift Wrap",
      link: "/gift-wrap-cards",
      category: "stationery",
    },
  ],
  supplies: [
    {
      text: "All Supplies",
      link: "/supplies",
      cover:
        "https://cdn.shopify.com/s/files/1/0001/5211/collections/Supplies-Category-Banner_2400x.jpg?v=1613980745",
      category: "supplies",
    },
    { text: "Pens & Pencils", link: "/pens-pencils", category: "supplies" },
    {
      text: "Staplers & Scissors",
      link: "/staplers-scissors",
      category: "supplies",
    },
  ],
  living: [
    {
      text: "All Home Decor",
      link: "/living",
      category: "living",
      cover:
        "https://cdn.shopify.com/s/files/1/0001/5211/collections/Living-CategoryBanner_766efb68-9ee3-4d21-ac0c-ac86bf218518_2400x.jpg?v=1625089921",
    },
    { text: "Drinkware", link: "/drinkware", category: "living" },
    { text: "Tabletop", link: "/tabletop", category: "living" },
  ],
  accessories: [
    {
      text: "Apparel",
      category: "accessories",
      link: "/apparel",
      cover:
        "https://cdn.shopify.com/s/files/1/0001/5211/collections/Category-Banner-Apparel_2400x.jpg?v=1582337459",
    },
    {
      text: "Accessories",
      link: "/accessories",
      category: "accessories",

      cover:
        "https://cdn.shopify.com/s/files/1/0001/5211/collections/Accessories-Category-Banner_2400x.jpg?v=1636768343",
    },
    { text: "Bags", link: "/bags", category: "accessories" },
    {
      text: "Wallets, Cases, Folios",
      link: "/wallets-cases-folios",
      category: "accessories",

      cover:
        "https://cdn.shopify.com/s/files/1/0001/5211/collections/Wallets-Cases-Category-Banner_2400x.jpg?v=1572284219",
    },
  ],
};

const PanelExpand = ({ panel, _panel, closex }) => {
  const ref = useRef(null);
  useEffect(() => {
    if (panel) {
      ref.current = panel;
    }
  }, [panel]);

  return (
    <div
      onMouseEnter={() => _panel(ref.current)}
      onMouseLeave={() => _panel(null)}
      className={`panel ${panel ? "active" : ""} ${panel}`}
    >
      <ul>
        {panel != null &&
          data[panel].map((src) => (
            <li>
              <Link onClick={closex} href={`/collections${src.link}`}>
                {src.text}
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default PanelExpand;
