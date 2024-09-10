import React, { useEffect, useState } from "react";
import Image from "next/image";
import { ShoppingBagIcon,CheckCircleIcon } from "@heroicons/react/solid";
import { useDarkMode } from "../atoms/darkModeAtom";
import { ProductsCartAtom } from "../atoms/ProductsCartAtom";
import { useRecoilState } from "recoil";

import Link from 'next/link'

export default function ProductThumbnail({product}) {
  const [darkMode] = useDarkMode();
  const [CartProducts, SetCartProducts] = useRecoilState(ProductsCartAtom);
    const [CheckedInCart,SetCheckedInCart]=useState(false)
    useEffect(()=>{
      const check=CartProducts.findIndex(x => x.title.trim() ===product.title.trim())
         check>=0 ? SetCheckedInCart(true): null
         check==-1 ?SetCheckedInCart(false):null


    },[CartProducts])
    
function AddProduct(product){
  SetCartProducts((CartProducts)=>[...CartProducts,product])
}

  return (
    <div className="relative bg-slate-200 w-[280px] md:w-[200px] xl:w-[250px] 2xl:w-[250px] mx-8 " >
      <Link
      href={`/Product/${product.title}`}
      >

   
      <span  className="h-full w-full cursor-pointer" >
        <div className=" relative 2xl:w-[250px] h-[250px] md:h-[200px] xl:h-[250px] 2xl:h-[250px]  ">
        <Image
          className=" "
          layout='fill'
          alt="Product Image"
          src={product.image}
        />          
        </div>

        <div className="space-y-2  py-7 pl-2 pr-4">
            
        <div className={`${darkMode? 'text-slate-800':'text-orange-500'}  font-semibold truncate text-lg`}>{product.category}</div>
        <div className=" truncate text-xl font-semibold " >{product.title}</div>
        <div className={`${darkMode? 'text-slate-800':'text-orange-500'}  font-semibold `}>${product.price}</div>
        </div>
      </span>
      </Link>
    {CheckedInCart ?
        <div  
        className={`group absolute bottom-2 right-2 bg-green-600  rounded-full p-1`}  > 
          <CheckCircleIcon className=" w-8 h-8 text-white  group-hover:animate-pulse" />
        </div>
        :
          <button  
          onClick={()=>{
            SetCheckedInCart(true)
            AddProduct(product)}}
          className={`group absolute bottom-2 right-2 ${darkMode? 'bg-slate-800':'bg-orange-500'}  rounded-full p-1`}  > 
            <ShoppingBagIcon className=" w-8 h-8 text-white  group-hover:animate-pulse" />
          </button>

    } 

    </div>
  );
}
