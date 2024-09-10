import { initiateCheckout } from "../lib/payments";
import { useState, createContext, useContext, useEffect } from "react";
import products from "../products.json";

interface Product {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
}

const defaultCart = {
  products: {},
};

export const useCartState = () => {
  const [cart, setCart] = useState(defaultCart);

  useEffect(() => {
    const storedState = window.localStorage.getItem("space-jellyfish-cart");
    const data = storedState && JSON.parse(storedState);
    if (data) {
      setCart(data);
    }
  }, []);

  useEffect(() => {
    if (cart !== defaultCart) {
      const data = JSON.stringify(cart);
      window.localStorage.setItem("space-jellyfish-cart", data);
    }
  }, [cart]);

  const addToCart = ({ id }: { id?: string } = {}) => {
    if (!id) {
      return;
    }
    setCart((prev) => {
      //@ts-ignore
      if (prev.products[id]) {
        return {
          ...prev,
          products: {
            ...prev.products,
            //@ts-ignore
            [id]: { id, quantity: prev.products[id].quantity + 1 },
          },
        };
      } else {
        return {
          ...prev,
          products: {
            ...prev.products,
            [id]: { id, quantity: 1 },
          },
        };
      }
    });
  };

  const updateCart = ({
    id,
    quantity,
  }: { id?: string; quantity?: number } = {}) => {
    if (!id) {
      return;
    } //@ts-ignore
    setCart((prev) => {
      //@ts-ignore
      if (prev.products[id]) {
        return {
          ...prev,
          products: {
            ...prev.products,
            //@ts-ignore
            [id]: { id, quantity: quantity },
          },
        };
      }
    });
  };

  const cartItems = Object.keys(cart.products).map((key) => {
    const product: Product | undefined = products.find(
      ({ id }) => `${id}` === `${key}`
    );
    return {
      //@ts-ignore
      ...cart.products[key],
      pricePerItem: (product as Product).price,
    };
  });

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.pricePerItem * item.quantity,
    0
  );

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const checkout = () => {
    initiateCheckout({
      lineItems: cartItems.map((item) => ({
        price: item.id,
        quantity: item.quantity,
      })),
    });
  };

  return { totalPrice, totalItems, addToCart, checkout, cartItems, updateCart };
};

export const CartContext = createContext({});

export const useCart = () => {
  const cart = useContext(CartContext);
  return cart;
};
