"use client";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { GetContext } from "../layout";
import products from "../../products.json";
import Image from "next/image";
import Link from "next/link";
import { CloseIcon } from "@/components/Icons";

const Page = () => {
  const { data, _data } = GetContext();
  const [cart, _cart] = useState([]);
  const [totalprice, _totalprice] = useState(0);

  useEffect(() => {
    console.log({ data });
    const newCartItems = data
      .filter((_) => _.type == "cart")
      .map((_) => {
        const product = products.find((_p) => _p.text == _.text);
        return { count: _.count, product };
      });
    _cart(newCartItems);
  }, [data]);

  useEffect(() => {
    let tc = 0;
    cart.map((_) => {
      console.log({ _ });
      tc += parseInt(_.count) * parseFloat(_.product.price.slice(1));
    });
    _totalprice(tc);
  }, [cart]);

  return (
    <div className="cartpage">
      <div className="left">
        <h1>Shopping Cart</h1>
      </div>
      <div className="list">
        <ul>
          {cart.map((cr) => {
            const { product, count } = cr;
            const link = `/collections/${product.subcategory}/${product.link}`;
            return (
              <li>
                <Link className="pp" href={link}>
                  <Image
                    width={120}
                    height={120}
                    alt="img"
                    src={product.cover}
                  />
                </Link>
                <div className="div">
                  <Link href={link}>
                    <p className="text">{product.text}</p>
                  </Link>
                  <p className="price">{product.price}</p>
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const el = e.target.elements[`count ${product.text}`];
                    el.blur();
                    const val = el.value || 1;

                    const newData = data.map((a) => {
                      if (a.text == product.text) {
                        return { ...a, count: val };
                      }
                      return a;
                    });
                    _data(newData);
                    window.localStorage.setItem(
                      "data",
                      JSON.stringify(newData)
                    );
                  }}
                >
                  <input
                    id={`count ${product.text}`}
                    type="number"
                    max={100}
                    min={1}
                    defaultValue={count}
                  />
                </form>
                <button
                  onClick={() => {
                    const ndata = data.filter(
                      (_) => _.type != "cart" || _.text != product.text
                    );
                    _data(ndata);
                    window.localStorage.setItem("data", JSON.stringify(ndata));
                  }}
                >
                  <CloseIcon />
                </button>
              </li>
            );
          })}
        </ul>
        <div className="down">
          <p className="sm">${totalprice}</p>
          <textarea
            placeholder="Special instructions for seller"
            name=""
            id=""
            maxLength={151}
            cols="30"
            rows="10"
          ></textarea>
          <p className="smx">
            <span>TOTAL: </span>${totalprice.toLocaleString()}
          </p>
          <div className="x">Shipping & taxes calculated at checkout</div>
          <button className="co" onClick={() => alert("demo:)")}>
            CHECKOUT
          </button>
        </div>
      </div>
    </div>
  );
};

export default Page;
