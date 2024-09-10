import React, { useEffect, useState } from "react";
import { useDarkMode } from "../../atoms/darkModeAtom";
import { CartMenuAtom } from "../../atoms/CartMenuAtom";
import {
  ProductsCartAtom,
  ProductsCartStatsState,
} from "../../atoms/ProductsCartAtom";

import { useRecoilState, useRecoilValue } from "recoil";

import CartMenuItem from "./CartMenuItem";
import preview2 from "../../data/Preview2";
export default function CartMenu() {
  const [darkMode] = useDarkMode();
  const [MenuOpen, SetMenuOpen] = useRecoilState(CartMenuAtom);
  const [CartProducts, SetCartProducts] = useRecoilState(ProductsCartAtom);
  const { TotalPrice, totalNum } = useRecoilValue(ProductsCartStatsState);

  function Remove(product) {
    SetCartProducts((CartProducts) =>
      CartProducts.filter((prod) => prod.id !== product.id)
    );
  }

  return (
    <div
      className={`${
        MenuOpen ? "flex" : "hidden"
      } space-y-3  fixed  top-0  right-0  z-[8887] w-screen  md:w-[40vw] 2xl:w-[30vw] h-screen overflow-x-hidden overflow-y-scroll pt-[110px]   flex-col            ${
        darkMode
          ? "bg-slate-900 text-white border-l-white"
          : "bg-white text-black border-l-black"
      } md:border-l-4  px-4 sm:px-5 lg:px-14 `}
    >
      <button
        className=" py-2 px-5 rounded-full border-gray-600 border-2 self-end "
        onClick={() => SetMenuOpen(false)}
      >
        Close
      </button>

      {totalNum > 0 ? (
        <>
          <div>
            {CartProducts.map((product, i) => (
              <CartMenuItem
                product={product}
                key={i}
                id={i}
                onRemove={Remove}
              />
            ))}
          </div>
          <button
            className={` text-center rounded-2xl py-2 px-5 text-white ${
              darkMode ? "bg-slate-800" : "bg-orange-500"
            }`}
          >
            <b> {"$" + TotalPrice.toFixed(2)} </b> Go To checkout
          </button>
        </>
      ) : (
        <>
        <div
        className="min-h-[75vh] flex items-center justify-center text-gray-600"
        >
        Your Shopping Cart is Empty
        </div>
        </>
      )}
    </div>
  );
}
