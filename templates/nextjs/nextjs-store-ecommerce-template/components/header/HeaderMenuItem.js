import React from 'react'
import Link from 'next/link'

export default function HeaderMenuItem({Icon,Title,Link}) {
  return (
   <a href={Link} className="group flex flex-col items-center justify-center text-4xl font-Inter font-normal tracking-wide		text-white">
    {Title}
    <span className="w-0 h-1 bg-white  transform origin-center duration-300 ease-in-out group-hover:w-full"></span>
   </a>                                               
    )
}
