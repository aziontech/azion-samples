import React from "react";
import { FaShoppingCart } from "react-icons/fa";
import styles from "./Nav.module.css";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

const Nav = () => {
  const { totalPrice, checkout, totalItems } = useCart();
  return (
    <nav className={styles.nav}>
      <div className={styles.main}>
        <p className={styles.navTitle}>Space Jelly Shop</p>
        <p className={styles.description}>
          The best space jellyfish swag on the web!
        </p>
      </div>
      <p>
        <Link href="/cart">
          <button>
            <FaShoppingCart size={22} color="whitesmoke" />
            <p>{totalPrice} €</p>
          </button>
        </Link>
      </p>
    </nav>
  );
};

export default Nav;
