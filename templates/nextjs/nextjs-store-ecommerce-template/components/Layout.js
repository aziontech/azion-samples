import Header from './header/Header'
import React, {  useEffect ,useState } from "react";
import CartMenu from '../components/ShoppingCart/CartMenu'
export default function Layout({children}) {
  return (
    <div>
        <Header />
          <CartMenu  />
            {children}
    </div>
  )
}


/*export async function getServerSideProps(context){
  const categories = [
    "electronics",
    "men's ",
    "women's ",
    "men's ",
    "women's ",
    "men's ",
    "women's ",
  ];
 const request=await fetch('https://fakestoreapi.com/products/categories')
  const categories = await request.json()
  return{
    props:{
    //  categories:categories
    categories
    }
  }

}*/