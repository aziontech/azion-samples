import React,{useState,useEffect} from 'react'
import preview2 from '../data/Preview2'
import Image from 'next/image'
import { useDarkMode } from "../atoms/darkModeAtom";
import ReactStars from 'react-stars'
import { ShoppingBagIcon,CheckCircleIcon } from "@heroicons/react/solid";
import { ProductsCartAtom } from "../atoms/ProductsCartAtom";
import { useRecoilState } from "recoil";

export default function ProductPage({product}) {
    const [darkMode] = useDarkMode();
    const [rating, setRating] = useState(product.rating.rate) 
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
  
    const ratingChanged = (rate) => {
      setRating(rate)
    }
  

  return (
    <div 
    
    className={`w-screen md:h-screen md:flex md:flex-col md:items-center md:justify-center md:pt-0   px-4 sm:px-5 lg:px-14 pt-[115px]  pb-[30px]  ${
        darkMode ? "text-white bg-slate-900" : "text-black"
      } `}
    >
              <div className="relative flex flex-col items-center justify-center md:grid md:grid-cols-2 md:gap-9 ">
        <div className=" relative w-full h-[320px] lg:h-[500px]  2xl:w-[60%] 2xl:h-[400px] 2xl:ml-[25%] ">
          <Image layout="fill" alt="Product Image" src={product.image} />
        </div>
        <div className="text-center py-10 space-y-3   ">
          <h4 className="font-extrabold text-xs">MEN`S SANDALS</h4>
          <h1 className={`font-semibold text-5xl md:text-left `}>
            {product.title}
          </h1>
          <p className="font-medium text-lg text-gray-500 md:text-left">
            {product.description}
          </p>
          <div className='text-left flex items-center'>
            Rating :    <ReactStars
            count={5}
            onChange={ratingChanged}
            size={30}
            color2={"#ffd700"}
            value={rating}
            edit={false}
          />
          </div>
       
          {CheckedInCart ?
          <div
          className='flex flex-col items-center justify-center'
          >
        <div  
        className={`  bg-green-600  rounded-full p-1`}  > 
          <CheckCircleIcon className=" w-8 h-8 text-white  group-hover:animate-pulse" />
        </div></div>
        :
          <button
                    onClick={()=>{
                      SetCheckedInCart(true)
                      AddProduct(product)}}
            className={`text-center rounded-2xl py-2 px-5 text-white ${
              darkMode ? "bg-slate-800" : "bg-orange-500"
            }`}
          >
            {"$" + product.price} Add To Cart
          </button>
}
        </div>
      </div>
    </div>
  )
}
