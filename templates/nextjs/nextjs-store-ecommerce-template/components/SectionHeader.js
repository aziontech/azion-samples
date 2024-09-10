import React from "react";
import { useDarkMode } from "../atoms/darkModeAtom";  
import Link from 'next/link'

export default function SectionHeader({ Maintitle, SecondTitle, Link }) {
  const [darkMode] = useDarkMode();
  return (
    <div className= {`w-full flex justify-between items-center  ${!darkMode?'bg-orange-500':'bg-slate-900'} text-white py-5 px-4 sm:px-5 lg:px-14`}>
      <div className="text-lg  sm:text-2xl  font-semibold">{Maintitle}</div>
      {SecondTitle && <a href={Link} className="text-sm font-medium sm:text-xl underline underline-offset-4 hover:opacity-50">{SecondTitle}</a>}
    </div>
  );
}
