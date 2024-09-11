"use client";

import { RightIcon } from "@/components/Icons";
import Link from "next/link";
import React, { useEffect } from "react";
import products from "../products.json";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

function Home() {
  useEffect(function () {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const intersecting = entry.isIntersecting;
        if (intersecting) {
          entry.target.classList.add("down-to-up");
        }
      });
    });
    observer.observe(document.querySelector(".container1 > .box"));
  }, []);
  useEffect(function () {
    const observer = new IntersectionObserver((entries) => {
      entries.map((entry, index) => {
        const intersecting = entry.isIntersecting;
        if (intersecting) {
          entry.target.classList.add("down-to-up");
          entry.target.style.animationDelay = `${index * 120}ms`;
        } else {
          entry.target.style.animationDelay = `0ms`;
        }
      });
    });
    Array.from(document.querySelectorAll("#productsx1 > li")).map((obj) =>
      observer.observe(obj)
    );
  }, []);

  return (
    <div className="home">
      <Swiper
        slidesPerView={1}
        loop={true}
        pagination={{
          clickable: true,
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper"
      >
        <SwiperSlide>
          <div className="container1">
            <div className="box">
              <h1>NEW Rainbow Spectrum Planner</h1>
              <p>
                It’s never too late to get organized with this portable version
                of your favorite wall planner.
              </p>
              <Link href={`/collections/best-sellers/rainbow-spectrum-planner`}>
                <p>SHOP NOW</p>
                <RightIcon />
              </Link>
              <div className="white-layer"></div>
            </div>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="container2">
            <div className="box">
              <h1>NEW Rainbow Spectrum Planner</h1>
              <p>
                It’s never too late to get organized with this portable version
                of your favorite wall planner.
              </p>
              <Link href={`/collections/best-sellers/rainbow-spectrum-planner`}>
                <p>SHOP NOW</p>
                <RightIcon />
              </Link>
              <div className="white-layer"></div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
      <section className="split">
        <Link href={"/collections/living"} className="split1">
          <p>Serveware</p>
          <div className="layer"></div>
        </Link>
        <Link href={"/collections/accessories"} className="split2">
          <p>Accessories</p>
          <div className="layer"></div>
        </Link>
      </section>
      <ul id="productsx1">
        {products
          .filter((_, index) => index >= 8 && index < 16)
          .map((product) => {
            return (
              <li key={product.link}>
                <Link
                  href={`/collections/${product.subcategory}/${product.link}`}
                >
                  <Image
                    className="cover"
                    width={250}
                    height={250}
                    src={product.cover}
                    alt="obj"
                  />
                  <Image
                    className="secondary"
                    width={250}
                    height={250}
                    src={product.secondary}
                    alt="obj"
                  />
                  <div className="text">
                    <p className="text">{product.text}</p>
                    <p className="price">{product.price}</p>
                  </div>
                </Link>
              </li>
            );
          })}
      </ul>
    </div>
  );
}

export default Home;
