import React, { useEffect, useState } from "react"
import { Helmet } from "react-helmet"
import Header from "./Header"
import Footer from "./Footer"
import ScrollToTop from "../containers/ScrollToTop"

import "../../assets/css/bootstrap.min.css"
import "../../assets/css/lineicons.css"
import "../../assets/css/tiny-slider.css"
import "../../assets/css/main.css"

const Layout = ({ children, menuItems }) => {
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const sections = document.querySelectorAll('.page-scroll');
      const scrollPos = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;

      for (let i = 0; i < sections.length; i++) {
        const currLink = sections[i];
        const currLinkHref = currLink.getAttribute('href');
        const val = currLinkHref.replace("/", "");

        const refElement = document.querySelector(val);
        const scrollTopMinus = scrollPos + 73;

        if (refElement && refElement.offsetTop <= scrollTopMinus && (refElement.offsetTop + refElement.offsetHeight > scrollTopMinus)) {
          setActiveLink(currLinkHref)
        }
      }
    };

    window.document.addEventListener('scroll', onScroll, { passive: true });
    return () => window.document.removeEventListener('scroll', onScroll);
  }, []);


  return (
    <>
      <Helmet>
        <meta http-equiv="Content-Security-Policy" content="frame-ancestors 'self' https://buttercms.com;" />
      </Helmet>

      <Header menuItems={menuItems} activeLink={activeLink} />

      {children}

      <ScrollToTop />

      <Footer menuItems={menuItems} activeLink={activeLink} />
    </>
  )
}

export default Layout;
