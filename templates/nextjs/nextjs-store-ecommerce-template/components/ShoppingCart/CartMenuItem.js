import React from 'react'
import Image from 'next/image'

import {ProductsCartAtom} from '../../atoms/ProductsCartAtom'
import { useRecoilState } from "recoil";
export default function CartMenuItem({product,onRemove}) {
  const [CartProducts, SetCartProducts] = useRecoilState(ProductsCartAtom);

 

  return (
    <div className='relative w-full flex flex-col items-center justify-center space-y-3 py-10'>
        <div className='relative w-full grid grid-cols-2 '>
            <div className=' w-full flex items-center justify-center'>
            <div className='relative w-[130px] h-[130px] '>
            <Image
            layout='fill'
            src={product.image}
            alt='Product Preview Image'
            />
        </div>

            </div>
        
        <div className='space-y-2 '>
            <h1>{product.title}</h1>
            <p className='truncate'>
            {product.description}
            </p>
        </div>

        </div>

        <div>
            Price : {product.price}
        </div>
        <button
            className={`text-center rounded-2xl py-2 px-5 text-white bg-red-600`}
            onClick={()=>{onRemove(product)}}
          >
            {"$" + product.price} Remove From Cart
          </button>
    </div>
  )
}
