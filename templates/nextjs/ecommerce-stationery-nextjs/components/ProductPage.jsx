import React, { useEffect, useRef, useState } from "react";
import NotFound from "./NotFound";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper";
import Image from "next/image";
import { GetContext } from "@/app/layout";
import { HeartIcon, StartIcon } from "./Icons";
import { useRouter } from "next/navigation";
import products from "../products.json";
import Link from "next/link";

const ProductPage = ({ product }) => {
  const nav = useRouter();
  const { data, _data, _n, _favoritespopup } = GetContext();
  const [isfavoritesadded, _isfavoritesadded] = useState(false);
  const { text, cover, secondary, price } = product;

  useEffect(() => {
    _isfavoritesadded(
      data.find((_) => _.type == "favorites" && _.text == text) && true
    );
  }, [data]);
  useEffect(function () {
    const observer = new IntersectionObserver((entries) => {
      entries.map((entry, index) => {
        const intersecting = entry.isIntersecting;
        if (intersecting) {
          entry.target.classList.add("down-to-up");
        }
      });
    });
    observer.observe(document.querySelector(".texts"));
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
    Array.from(document.querySelectorAll("#productsx3 > li")).map((obj) =>
      observer.observe(obj)
    );
  }, []);
  const addfavorite = () => {
    const type = "favorites";
    if (isfavoritesadded) return;
    _data([{ type, text }, ...data]);
    _n(true);
    window.localStorage.setItem(
      "data",
      JSON.stringify([{ type, text }, ...data])
    );
  };
  const contentRef = useRef(null);
  const onSubmit = (e) => {
    e.preventDefault();
    const count = e.target.elements.count.value || 1;
    const ie = data.find((obj) => obj.type == "cart" && obj.text == text);
    const type = "cart";
    if (ie) {
      ie.count = count;
      const _newdata = data.map((obj) => {
        if (obj.text == text && obj.type == type) return ie;
        return obj;
      });
      _data(_newdata);
      window.localStorage.setItem("data", JSON.stringify(_newdata));
    } else {
      const xx = [{ type, text, count }, ...data];
      _data(xx);
      window.localStorage.setItem("data", JSON.stringify(xx));
    }
    nav.push("/cart");
  };
  const openfav = () => _favoritespopup(true);
  useEffect(() => {
    const worker = () => {};
    window.addEventListener("scroll", worker);
  }, [contentRef.current]);
  if (!product) return <NotFound />;

  return (
    <div className="productpage">
      <div className="details">
        <div className="images">
          <Swiper
            slidesPerView={1}
            loop={true}
            pagination={{
              clickable: true,
            }}
            modules={[Pagination]}
            className="mySwiper"
          >
            {[cover, secondary].map((img) => {
              return (
                <SwiperSlide>
                  <div className="ta">
                    <Image
                      src={img}
                      quality={100}
                      alt="img"
                      width={500}
                      height={500}
                    />
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
        <div className="texts">
          <h1>{text}</h1>
          <h2>{price}</h2>
          <span className="down">
            <form onSubmit={onSubmit}>
              <input
                defaultValue={1}
                max={100}
                min={1}
                type="number"
                name="count"
                id="count"
              />
              <button type="submit">ADD TO CART</button>
            </form>
            <button
              onClick={addfavorite}
              className={`heart ${isfavoritesadded ? "active" : ""}`}
            >
              <HeartIcon />
              <div className="uppopup">
                Added. <span onClick={openfav}>View Wishlist</span>
              </div>
            </button>
          </span>
          <p className="desc">
            this description demo all product same. Our best-selling
            poster-sized wall planner is a giant wall calendar with a new design
            inspired by the innate beauty of color. The Spectrum Wall Planner is
            open-dated, so you can start using it at any time. Display page by
            page or at once for a powerful long-term planning tool. Don't forget
            our Acrylic Poster Frame to hang this up! Lorem ipsum, dolor sit
            amet consectetur adipisicing elit. Necessitatibus optio ex similique
            praesentium impedit labore dignissimos quis quos, asperiores magnam
            eius, magni, distinctio temporibus!
            <div className="spc"></div>
            <span>FSC Chain of Custody Certified paper</span>
            <span>12-month calendar</span>
            <span>Dimensions: 30.1" x 20.6" (76.5 cm x 52.2 cm)</span>
            <span className="red">
              Please note there may be additional shipping charges for
              International Orders on this item. This item cannot be shipped via
              DHL. Additionally, this item cannot be gift-wrapped.
            </span>
            <span className="d">
              Don't take our word for it. See all the reviews for this item
              below.
            </span>
          </p>
          <div className="reviews">
            <h1>Customer Reviews</h1>
            <ul>
              <li>
                <div className="stars">
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                </div>
                <h1 className="title">Sooooo cute and practical</h1>
                <h2 className="dx">
                  Gabby B <span>on</span>Mar 20, 2022
                </h2>
                <p className="r">
                  I’m obsessed with this calendar! It was challenging to hang,
                  but I was up for the challenge. The result is so good. Plan on
                  using with sticky notes year after year!
                </p>
              </li>
              <li>
                <div className="stars">
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                </div>
                <h1 className="title">A-MAZING!</h1>
                <h2 className="dx">
                  Tatiana Hall <span>on</span>Jan 18, 2022
                </h2>
                <p className="r">
                  I received my spectrum wall calendar last week and oh boy… it
                  didn’t disappoint! Exactly as pictured! It is hard to find a
                  calendar like this, most out there are dull and small. I work
                  in real estate and this is the perfect size to keep everything
                  organized and legible. I have received lots of compliments!
                </p>
              </li>
              <li>
                <div className="stars">
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                </div>
                <h1 className="title">Perfection</h1>
                <h2 className="dx">
                  Danielle amari <span>on</span>Jan 14, 2022
                </h2>
                <p className="r">
                  We love calendars. Finding one that big and not as boring as
                  dust is so hard to find. Poketo’s rainbow-tastic wall calendar
                  is our new go to. We hope they never stop making these. It’s
                  nice they are in single sheets so you can use them one at a
                  time or hang up multiples. We lined our massive hallway with
                  the entire year. Even better, you can write in the dates, so
                  it doesn’t matter when you buy it- it’s always good!
                </p>
              </li>
              <li>
                <div className="stars">
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                </div>
                <h1 className="title">The perfect planner</h1>
                <h2 className="dx">
                  Jo <span>on</span>Jan 03, 2022
                </h2>
                <p className="r">
                  I am obsessed with my new planner. It is the perfect size and
                  has a great amount of space to fill in what you need for each
                  day. I also love the colors. They are super calming which for
                  me is necessary when writing out all the things I need to do!
                </p>
              </li>
              <li>
                <div className="stars">
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                </div>
                <h1 className="title">Perfect apartment color pop!</h1>
                <h2 className="dx">
                  Toni Bish <span>on</span>Jan 03, 2022
                </h2>
                <p className="r">
                  Wall calendars with space to write <span>on</span>make my
                  households lives run much more smoothly but I’ve never been
                  able to find a colorful hanging one that wasn’t grandma
                  florals. Until THISSSS! This perfect calendar! It’s so great
                  in our apartment where we can’t paint the walls because it
                  also adds so much color! Would recommend.
                </p>
              </li>
              <li>
                <div className="stars">
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                  <StartIcon />
                </div>
                <h1 className="title">So excited for 2022!</h1>
                <h2 className="dx">
                  Cecelia <span>on</span>Nov 04, 2021
                </h2>
                <p className="r">
                  I have been looking for a calendar that will also make a
                  statement in my home and this was the perfect find! The colors
                  are complimentary and I love that I can fill things in as I
                  go.
                </p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="maybe-like">
        <div className="left">
          <h1>You may also like</h1>
        </div>
        <ul id="productsx3">
          {products
            .filter((a) => a.text != text)
            .filter((_, index) => index < 4)
            .map((product) => {
              return (
                <li key={product.link}>
                  <Link
                    href={`/collections/${product?.subcategory}/${product.link}`}
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
    </div>
  );
};

export default ProductPage;
