"use client";
import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import data from "../../../data.json";
import products from "../../../products.json";
import ProductPage from "@/components/ProductPage";
import Link from "next/link";
import Image from "next/image";

function Page() {
  const { a: params } = useParams();
  const [categoryname, productname] = params.split("/");
  const obj = data?.find((obj) => obj.link == `/${categoryname}`);

  useEffect(function () {
    const observer = new IntersectionObserver((entries) => {
      entries.map((entry, index) => {
        const intersecting = entry.isIntersecting;
        if (intersecting) {
          entry.target.classList.add("down-to-up");
          entry.target.style.animationDelay = `${index * 120}ms`;
        } else {
          entry.target.style.animationDelay = "0ms";
        }
      });
    });
    Array.from(document.querySelectorAll("#productsx3 > li")).map((obj) =>
      observer.observe(obj)
    );
  }, []);

  if (!obj) return <></>;
  if (productname) {
    return (
      <ProductPage product={products.find((p) => p.link == productname)} />
    );
  }

  return (
    <div className="products">
      <div className="title" style={{ backgroundImage: `url(${obj.cover})` }}>
        <h1>{obj.text}</h1>
      </div>
      <div className="options">
        <select
          name="filter-by"
          class="filter-by styled"
          data-label="PRODUCT TYPE"
        >
          <option value="" class="default" disabled="" selected="">
            PRODUCT TYPE
          </option>
          <option value="">All</option>
          <option value="a5-notebook">A5 Notebook</option>
          <option value="a5-planner">A5 Planner</option>
          <option value="acrylic">Acrylic</option>
          <option value="activity">Activity</option>
          <option value="apothecary">Apothecary</option>
          <option value="bags">Bags</option>
          <option value="bamboo-tableware">Bamboo Tableware</option>
          <option value="best-sellers">Best Sellers</option>
          <option value="blank-notebook">Blank Notebook</option>
          <option value="books">Books</option>
          <option value="bundles">Bundles</option>
          <option value="calendar">Calendar</option>
          <option value="cards-birthday">Cards - Birthday</option>
          <option value="cards-holiday">Cards - Holiday</option>
          <option value="cards-love">Cards - Love</option>
          <option value="cards-thank-you">Cards - Thank You</option>
          <option value="clips-bookmark">Clips &amp; Bookmark</option>
          <option value="clutches">Clutches</option>
          <option value="combs-mirrors">Combs &amp; Mirrors</option>
          <option value="concept-planner">Concept Planner</option>
          <option value="crow-canyon-home-collection">
            Crow Canyon Home Collection
          </option>
          <option value="desk-accessories">Desk Accessories</option>
          <option value="dinnerware">Dinnerware</option>
          <option value="drinkware">Drinkware</option>
          <option value="folder">Folder</option>
          <option value="gift-card">Gift Card</option>
          <option value="gift-certificate">gift certificate</option>
          <option value="gift-sets">Gift Sets</option>
          <option value="hats">Hats</option>
          <option value="home-decor">Home Decor</option>
          <option value="kitchen">Kitchen</option>
          <option value="lined-notebook">Lined Notebook</option>
          <option value="memorial-day">memorial day</option>
          <option value="minimalist-collection">Minimalist Collection</option>
          <option value="new-arrivals">New Arrivals</option>
          <option value="new-horizon">New Horizon</option>
          <option value="notebook">Notebook</option>
          <option value="notepad">Notepad</option>
          <option value="object-notebook">Object Notebook</option>
          <option value="objects">Objects</option>
          <option value="packs">Packs</option>
          <option value="pattern-best-sellers">Pattern Best Sellers</option>
          <option value="pens-pencils">Pens &amp; Pencils</option>
          <option value="planners">Planners</option>
          <option value="prints">Prints</option>
          <option value="project-planner">Project Planner</option>
          <option value="sale">Sale</option>
          <option value="scissors-stapler">Scissors/Stapler</option>
          <option value="shop-all">Shop All</option>
          <option value="shoulder-bags">Shoulder Bags</option>
          <option value="socks">Socks</option>
          <option value="stationary">stationary</option>
          <option value="stickies">Stickies</option>
          <option value="tableware">Tableware</option>
          <option value="textiles">Textiles</option>
          <option value="wallets">Wallets</option>
          <option value="wellness">wellness</option>
        </select>
        <select name="sort-by" id="sort-by" data-label="SORT" class="styled">
          <option value="default" class="default" disabled="" selected="">
            SORT
          </option>
          <option value="manual">Featured</option>
          <option value="best-selling">Best Selling</option>
          <option value="price-ascending">Price, low to high</option>
          <option value="price-descending">Price, high to low</option>
        </select>
      </div>
      <ul id="productsx3">
        {products.map((product) => {
          return (
            <li key={product.link}>
              <Link href={`/collections/${categoryname}/${product.link}`}>
                <Image
                  className="cover"
                  width={250}
                  height={250}
                  src={product.cover}
                  alt="obj"
                />
                <Image
                  className="secondary"
                  width={250}
                  height={250}
                  src={product.secondary}
                  alt="obj"
                />
                <div className="text">
                  <p className="text">{product.text}</p>
                  <p className="price">{product.price}</p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Page;
