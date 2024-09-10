import { GetContext } from "@/app/layout";
import React, { useEffect, useState } from "react";
import { CloseIcon, DottedMenu } from "./Icons";
import products from "../products.json";
import Image from "next/image";
import Link from "next/link";

const FavoritesPopup = ({ closeFav }) => {
  const { data, _data } = GetContext();
  const [favorites, _favorites] = useState([]);
  useEffect(() => {
    const fav = data
      .filter((_) => _.type == "favorites")
      .map((_) => {
        const product = products.find((p) => p.text == _.text);
        const isaddedcart = data
          .filter((_xa) => _xa.type == "cart")
          .find((_xd) => _xd.text == _.text);
        return { ...product, isaddedcart };
      });
    _favorites(fav);
  }, []);

  const tap = (f) => {
    if (f.isaddedcart) return;
    const n = [{ count: 1, text: f.text, type: "cart" }, ...data];
    _data(n);
    _favorites((p) =>
      p.map((_) => {
        if (_.text == f.text) return { ..._, isaddedcart: true };
        return _;
      })
    );
    window.localStorage.setItem("data", JSON.stringify(n));
  };

  const deletef = (f) => {
    const ndata = data.filter((_) => _.type != "favorites" || _.text != f.text);
    _data(ndata);
    _favorites((p) => p.filter((_) => _.text != f.text));
    window.localStorage.setItem("data", JSON.stringify(ndata));
  };

  return (
    <>
      <div className="bg" onClick={closeFav}></div>
      <div className="favoritespopup">
        <div className="upline">
          <button onClick={closeFav}>
            <CloseIcon />
          </button>
        </div>
        <div className="second">
          <h2>My Wishlist</h2>
          <button>
            <DottedMenu />
          </button>
        </div>
        <ul>
          {favorites.map((fav) => {
            return (
              <li>
                <Link
                  href={`/collections/${fav.subcategory}/${fav.link}`}
                  onClick={closeFav}
                >
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deletef(fav);
                    }}
                    className="close"
                  >
                    <CloseIcon />
                  </button>
                  <Image width={200} height={200} src={fav.cover} />

                  <div className="text">
                    <p className="title">{fav.text}</p>
                    <p className="price">{fav.price}</p>
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        tap(fav);
                      }}
                    >
                      {fav.isaddedcart ? `ADDED TO CART` : `ADD TO CART`}
                    </button>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </>
  );
};

export default FavoritesPopup;
