import React from "react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import Link from 'next/link'

export default function DropDownList({ title, type, list }) {
  return (
    <Link href={'/Products'}>
    <span className="cursor-pointer hidden md:flex font-bold	text-sm lg:text-xl relative group outline-none  items-center justify-center rounded-lg text-white transform transition-all duration-500 ease-in-out  hover:bg-white hover:bg-opacity-10  ">
      {title}
      {list && (
        <>
                <ChevronDownIcon className="h-5 w-5 text-gray-200 transition-all duration-700 ease-in-out group-hover:rotate-180" />
                <div className=" hidden min-w-[190px] border-solid border-[1px] border-gray-100 drop-shadow-2xl absolute top-full left-0  text-black transition-all duration-300 ease-in-out opacity-0 group-hover:opacity-100 group-hover:inline  bg-white rounded-2xl">
        <div className="flex flex-col  ">

        {list.map((result, i) => (
          <Link 
          href={{
            pathname: '/Products',
            query: type=="brand"?{brand:result.title}:{},
          }}
          key={DropDownList+"_"+i} > 
            <span
              
              className="cursor-pointer font-semibold	 p-3 border-b-solid border-b-[1px] border-b-gray-100  transition-all duration-700 ease-in-out text-slate-800 text-sm hover:text-orange-500"
            >
              {result.title}
            </span>
            </Link>
        ))}

        </div>

      </div>
        </>
      )}

    </span>
      </Link>

  );
}
