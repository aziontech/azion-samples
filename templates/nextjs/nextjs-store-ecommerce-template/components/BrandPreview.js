import React from 'react'
import Image from "next/image";
import { useDarkMode } from "../atoms/darkModeAtom";
import { ChevronRightIcon} from "@heroicons/react/solid";
import Link from 'next/link'

export default function BrandPreview({brand}) {
  const [darkMode] = useDarkMode();


  return (
    <div className='flex flex-col justify-center text-center space-y-4 w-72 h-80 md:w-96 md:h-96'>
      <div className={`text-2xl font-semibold ${darkMode?'text-white':'text-black'} `}>
      {brand.title}
      </div>
      <div className='relative flex items-start justify-start w-full h-full group'>
        <div className={`w-1 h-full  ${darkMode?'bg-slate-800':'bg-orange-500'}`}></div>
        <a  className='relative cursor-pointer flex-1 w-full h-full transition duration-300 ease-in-out group-hover:blur-sm'   >
        <Image
          layout="fill"
          objectFit='fill'
          alt="Brand Image"
          src={brand.image}
        />
        </a>

    <div className='bg-stone-400 w-8 h-full'></div>

    <Link 
          href={{
            pathname: '/Products',
            query:{brand:brand.title}
          }}>
      <span className={`cursor-pointer absolute -right-5 top-[45%] p-1 rounded-full ${!darkMode? 'bg-orange-500':'bg-slate-800'}`}>
      <ChevronRightIcon className="w-9 h-9 text-white"  />
      </span>
          </Link>

      </div>
      <div className={`text-xl font-medium ${darkMode?'text-white':'text-black'} `}>      {brand.description}</div>
    </div>
  )
}
