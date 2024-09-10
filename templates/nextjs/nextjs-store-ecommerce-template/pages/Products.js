import React from "react";
import Head from "next/head";
import ProductList from "../components/Products/ProductList";
import preview2 from "../data/Preview2";
import Brands from "../data/Brands";
import Image from "next/image";
import { useDarkMode } from "../atoms/darkModeAtom";

export default function Products({brand}) {
  const [darkMode] = useDarkMode();
  const SortKeys = [
    {
      Name: "Price",
      value: "price",
    },
    {
      Name: "Name",
      value: "name",
    },
    {
      Name: "Release Date",
      value: "date",
    },
  ];
  return (
    <div>
       <Head>
        <title>Products</title>
        <meta name="description" content="Recommend Products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={` ${!darkMode?'bg-white':'bg-slate-900'}  pt-[65px] min-h-screen`}>
     
     {
       brand && 
       <div className={`relative w-screen   flex flex-col items-center justify-center xl:grid xl:grid-cols-3   `} >
       <div className="relative w-full h-[450px] xl:h-[500px]">
       <Image 
       layout='fill'
       src={brand.image}
       alt="Brand Image"
       />
       </div>
       <div className={`pt-8 xl:col-start-2 xl:col-end-4 xl:${darkMode?'bg-slate-800':'bg-orange-500'} xl:text-left  px-4 sm:px-5 lg:px-14 text-center`} >
         <h1 className={`${darkMode?'text-white':'text-black'} text-4xl font-bold  xl:text-6xl`}>
         {brand.title}
         </h1>
         <h3 className={`${darkMode?'text-gray-500':'text-gray-800'} text-xl font-bold  xl:text-3xl  xl:p-12 `}>
           {brand.desc2}
         </h3>
       </div>


     </div>
     }

     <div className="">
       {/* Filter Header */}
       <div
         className={` flex justify-between   w-screen  px-4 sm:px-5 lg:px-14 font-semibold pt-[50px] `}
       >
         <div className="flex flex-col space-y-3   sm:flex-row sm:space-y-0  sm:space-x-3">
         <select className={`${darkMode ? 'border-gray-200 focus:border-white bg-slate-900 text-white':'border-gray-200 focus:border-black bg-white text-black'} border-0 border-b-2  focus:ring-0 `}>
             <option defaultValue disabled hidden>
               Filter By:
             </option>
             {SortKeys.map(({ Name, value }, i) => (
               <option value={value} key={i}>
                 {Name}
               </option>
             ))}
           </select>
           <select className={`${darkMode ? 'border-gray-200 focus:border-white bg-slate-900 text-white':'border-gray-200 focus:border-black bg-white text-black'} border-0 border-b-2  focus:ring-0 `}>
             <option defaultValue disabled hidden>
               Sort By:
             </option>
             <option>Low To High</option>
             <option>High To Low</option>
           </select>
         </div>

         <button className={`text-sm font-medium sm:text-xl underline underline-offset-4 hover:opacity-50 ${darkMode ? 'text-white':'text-black'}`}>
           View All Products
         </button>
       </div>
       {/* Filter Header */}

       {/* Product list */}
       <div
         className={`px-4 sm:px-5 lg:px-20 py-5 `}
       >
         <ProductList products={preview2} />
       </div>
       {/* Product list */}
     </div>
   </div>
    </div>

  );
}

export const config = {
  runtime: "experimental-edge"
}


export async function getServerSideProps(context){
  const brand=context.query.brand?context.query.brand:null
 const BrandIndex=Brands.findIndex(x => x.title ===brand)

  return{
    props:{
      brand:BrandIndex==-1?null :  Brands[BrandIndex]
    }
  }
}
