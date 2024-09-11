import * as React from "react";
import { atom,selector } from "recoil";
import preview2 from '../data/Preview2'

export const ProductsCartAtom = atom({
  key: "ProductsCart",
  default: [preview2[0],preview2[5]],
});

export const ProductsCartStatsState = selector({
  key: 'ProductsCartStats',
  get: ({get}) => {
    const ProductsCart = get(ProductsCartAtom);
    const totalNum = ProductsCart.length;

    const TotalPrice =ProductsCart.reduce(
     ( acc,{price}) => acc  +price,
      0
    );
    return{ 
      totalNum,
      TotalPrice
    
    }
      
  },
});

