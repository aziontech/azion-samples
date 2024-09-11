import Head from 'next/head'
import Image from 'next/image'
import { useDarkMode } from "../atoms/darkModeAtom";
import React, { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, EffectFade, Navigation, Pagination } from "swiper";
import { ArrowSmRightIcon } from "@heroicons/react/solid";
import SectionHeader from '../components/SectionHeader'
import  TopSellingProd from '../components/home/TopSellingProd'
import TopBrands from "../components/home/TopBrands";
import Link from 'next/link'

import preview from '../data/PreviewProducts'
import Brands from '../data/Brands'
export default function Home() {
  const [darkMode] = useDarkMode();

  return (

    <div className={` ${!darkMode?'bg-white':'bg-slate-800 '}flex min-h-screen flex-col` }>
      <Head>
        <title>Store</title>
        <meta name="description" content="Recommend Products" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Home Page */}
      <div className="pt-[95px]">
      <div className="relative">
        <Swiper
          spaceBetween={50}
          slidesPerView={1}
          effect={"fade"}
          navigation={true}
          autoplay={{ delay: 2500 }}
          pagination={{
            clickable: true,
          }}
          modules={[EffectFade, Pagination, Navigation, Autoplay]}
          className="w-full  z-[1] "
        >
          <SwiperSlide className=" ">
            <div className="relative w-screen h-[300px]  sm:h-[400px] md:h-[480px]  lg:h-[550px] xl:h-[670px] ">
              <Image
                className=" "
                layout="fill"
                alt="Main Image"
                src="/img/mainImage.jpg"
                priority
              />
            </div>
          </SwiperSlide>

          <SwiperSlide className=" ">
            <div className="relative w-screen h-[300px]  sm:h-[400px] md:h-[480px]  lg:h-[550px] xl:h-[670px] ">
              <Image
                className=" "
                layout="fill"
                alt="Main Image"
                src="/img/mainImage2.jpg"
              />
            </div>
          </SwiperSlide>

          <SwiperSlide className=" ">
            <div className="relative w-screen h-[300px]  sm:h-[400px] md:h-[480px]  lg:h-[550px] xl:h-[670px] ">
              <Image layout="fill" alt="Main Image" src="/img/mainImage3.jpg" />
            </div>
          </SwiperSlide>
        </Swiper>
        <div className="absolute top-0 left-16 bottom-10 right-16 z-[2] flex flex-col items-center justify-center space-y-4 2xl:space-y-16 ">
          <div className="hidden space-y-4 2xl:space-y-14  sm:inline ">
            <span
              className={` ${
                !darkMode ? "text-orange-500" : "text-slate-800"
              } text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl  font-semibold `}
            >
              Discover
            </span>
            <br />
            <span className="flex space-y-1 text-white text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl  font-medium">
              Our New Products For You
            </span>
          </div>
          <div>
          <Link href={'/Products'}>
            <a
              className={`  ${
                !darkMode ? "bg-orange-500" : "bg-slate-800"
              } group  outline-none  flex space-y-1 text-white  items-center py-1 px-2 rounded-2xl text-base xl:py-3 xl:px-4 xl:text-4xl font-medium  `}
            >
              Shop Now
              <ArrowSmRightIcon className="w-9 h-9 xl:w-12 xl:h-12 group-hover:animate-pulse" />
            </a>
            </Link>
          </div>
        </div>
      </div>

      <div className="w-screen ">
       <SectionHeader Maintitle="Top Selling Products" SecondTitle="View All Products" Link=" "  />
       <TopSellingProd  products={preview}/>     
      </div>


      <div className={`w-screen `}>
       <SectionHeader Maintitle="Top Brands" SecondTitle="View All Brands" Link=" "  />
       <TopBrands  brands={Brands}/>     
      </div>

    </div>
      {/* Home Page */}

    </div>
  )
}

