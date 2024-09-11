import React, { useRef, useEffect, Fragment, useState } from "react";
import Image from "next/image";
import { useRecoilState, useRecoilValue } from "recoil";
import HeaderMenuItem from "./HeaderMenuItem";
import { MoonIcon, SearchIcon, ShoppingCartIcon, SunIcon, UserCircleIcon, XIcon } from "@heroicons/react/solid";
import { gsap } from "gsap";
import DropDownList from "./DropDownList";
import Search from "./Search";
import { darkModeAtom ,useDarkMode} from "../../atoms/darkModeAtom"
import Brands from '../../data/Brands'
import Link from 'next/link'
import {CartMenuAtom} from '../../atoms/CartMenuAtom'
import {ProductsCartAtom,ProductsCartStatsState} from '../../atoms/ProductsCartAtom'


export default function Header({ categories }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(false);
  const isInitialMount = useRef(true);
  const [darkMode, setDarkMode] = useDarkMode();
  const searchMobile = useRef(null);
  const [CartMenuOpen, SetCartMenuOpen] = useRecoilState(CartMenuAtom);
  const  {totalNum} = useRecoilValue(ProductsCartStatsState);


  const Menu = useRef(null);
  const wrap = useRef(null);
  const HeaderMenu = useRef(null);


  useEffect(() => {

    if (isInitialMount.current) {
      isInitialMount.current = false;
       } else {
    if(search){    
       
    gsap.to(searchMobile.current,{
        yPercent:80,
        opacity: 1,
        ease:'Expo.InOut',
        duration:0.8,
      })
    }
    else{
      gsap.to(searchMobile.current,{
        yPercent:-80,
        opacity: 0,
        ease:'Expo.InOut',
        duration:0.8
      })
    }
  }
  },[search]); 


  function OpenMenu() {
    gsap
      .timeline()
      .set(HeaderMenu.current, {
        display: "inline",
      })
      .to(wrap.current, {
        scale: 1.3,
        duration: 0.5,
        ease: "Expo.InOut",
      })
      .set(Menu.current.children, {
        opacity: 0,
      })
      .fromTo(
        Menu.current.children,
        {
          opacity: 0,
          yPercent: -50,
        },
        {
          opacity: 1,
          yPercent: 0,
          stagger: 0.4,
          ease: "Expo.InOut",
        }
      );
  }

  function CloseMenu() {
    gsap
      .timeline()
      .fromTo(
        Menu.current.children,
        {
          opacity: 1,
          yPercent: 0,
        },
        {
          opacity: 0,
          yPercent: -50,
          stagger: 0.2,
          ease: "Expo.InOut",
        }
      )
      .to(wrap.current, {
        scale: 0,
        duration: 0.5,
        ease: "Expo.InOut",
      })
      .set(HeaderMenu.current, {
        display: "none",
      });
  }

  function toggleTheme(){
    setDarkMode(!darkMode)
  }


  const [BrandsList, setBrands] = useState(null)
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
   /*setLoading(true)
    fetch('https://fakestoreapi.com/products/categories')
      .then((res) => res.json())
      .then((data) => {
          setcategories(data)
        setLoading(false)
      })
      */
      setBrands(Brands)
  }, [])

  if (isLoading) return <p>Loading...</p>
  if (!BrandsList) return <p>No data</p>
  return ( 
    <header className="fixed top-0 left-0 right-0 w-screen z-[8888]" >
        <div className={`relative flex justify-between   ${!darkMode?'bg-orange-500':'bg-slate-900'}  pt-4 w-screen  px-4 sm:px-5 lg:px-14 `} >

        <Link href={"/"} >
          <span>
          <Image
        src="/img/logo.png"
        height={80}
        width={180}
        alt="Logo"
        className="z-[100] cursor-pointer"
      />
          </span>
     
        </Link>

      <div className=" z-[100] flex items-center space-x-3 text-white text-xl">
        <div className="flex items-center space-x-7  text-base  pr-16  ">
          <DropDownList title="Products"  />
          <DropDownList title="brand" type="brand" list={BrandsList} />

          <DropDownList title="Contact" />


        </div>
          {/* Search Bar */}
          <Search style="relative  items-center bg-white space-x-3 py-3 px-3 rounded-xl hidden xl:flex" />
          {/* Search Icon */}
        <a className="cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 inline xl:hidden"  onClick={()=>{setSearch(!search)}}>
          <SearchIcon className="w-9 h-9 text-white"  />
        </a>

        {/* Account */}
        <a className=" cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hidden md:inline">
          <UserCircleIcon className="w-9 h-9 text-white" />
        </a>

        {/* Shopping */}
        <button
        onClick={()=>{SetCartMenuOpen(!CartMenuOpen)}}
        className={`relative cursor-pointer ${CartMenuOpen?'bg-white':''} p-2 bg-opacity-40 rounded-full transform transition-all duration-300 ease-in-out hover:scale-105`}>
          <ShoppingCartIcon className="w-9 h-9 text-white" />
          <span className="absolute -top-2 -right-2  text-xs bg-red-700 text-white rounded-full h-5 w-5 text-center flex items-center justify-center">
            {totalNum}
          </span>
        </button>

          {/* Theme */}
        <a className="cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hidden md:inline"   onClick={()=>{toggleTheme()}} >
        { 
          !darkMode ? <MoonIcon className="w-9 h-9 text-white"  /> : <SunIcon className="w-9 h-9 text-white"  />
        } 
          
        </a>
        <button
          onClick={() => {
            if (
              !(
                gsap.isTweening(HeaderMenu.current) ||
                gsap.isTweening(wrap.current) ||
                gsap.isTweening(Menu.current.children)
              )
            ) {
              setOpen(!open);
              open ? CloseMenu() : OpenMenu();
            }
          }}
          className="MenuButton cursor-pointer  flex flex-col items-center justify-center space-y-1 outline-0	md:hidden"
        >
          <span
            className={`w-8 h-1 bg-white rounded-full transform transition origin-[5px_3px] duration-500 ease-in-out ${
              open && `rotate-45`
            }`}
          ></span>
          <span
            className={`w-8 h-1 bg-white rounded-full transform transition origin-[5px_2px] duration-500 ease-in-out ${
              open && `-translate-x-1`
            } ${open && `opacity-0`}`}
          ></span>
          <span
            className={`w-8 h-1 bg-white rounded-full transform transition origin-[5px_3px] duration-500 ease-in-out ${
              open && `-rotate-45`
            }`}
          ></span>
        </button>
      </div>

      {/* Mobile Search */}
      <div 
      ref={searchMobile}
      className={`z-[110]  fixed top-0 left-0 w-screen pt-5   pb-6  px-3  items-center justify-around ${!darkMode?'bg-orange-500':'bg-slate-900'} flex transform -translate-y-[80%] opacity-0 ` }>
      <Search style="relative  items-center bg-white space-x-3 py-3 px-3 rounded-xl flex " />
       <button className={`p-3  rounded-2xl outline-none `}onClick={()=>{setSearch(!search)}}>
          <XIcon className="w-9 h-9 text-white" />
       </button>
      </div>
      {/* Menu Dropdown */}
      <div
        className="fixed overflow-hidden h-screen  w-screen top-0 left-0 hidden  z-[95]"
        ref={HeaderMenu}
      >
        <div
          ref={wrap}
          className={`rounded-bl-full h-screen  ${!darkMode?'bg-orange-500':'bg-slate-900'}  w-screen tranform origin-top-right scale-0`}  
        ></div>
        <div className=  {`flex flex-col items-center justify-center  h-screen w-screen  ${!darkMode?'bg-orange-500':'bg-slate-900'}  ` } >
          <div
            className="fixed top-0  h-screen w-screen flex flex-col items-center justify-center  space-y-10 text-center"
            ref={Menu}
          >
            <HeaderMenuItem Title="Account" Link="" />
            <HeaderMenuItem Title="Products" Link="" />
            <HeaderMenuItem Title="Categories" Link="" />
            <HeaderMenuItem Title="Brands" Link="" />
            <HeaderMenuItem Title="Contact" Link="" />
            <a className="cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 inline "   onClick={()=>{toggleTheme()}} >
        { 
          !darkMode ? <MoonIcon className="w-9 h-9 text-white"  /> : <SunIcon className="w-9 h-9 text-white"  />
        } 
          
        </a>
          </div>
        </div>
      </div>
        </div>
     

    </header>
  );
}
