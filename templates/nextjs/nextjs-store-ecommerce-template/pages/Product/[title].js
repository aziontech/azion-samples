import React,{useState,useEffect} from 'react'
import preview2 from '../../data/Preview2'
import ProductPage from '../../components/ProductPage'

export const config = {
  runtime: "experimental-edge"
}


export default function title({product}) {

    if(!product){  return ( <div className='min-h-screen flex items-center justify-center text-5xl'>Not Found</div>)}
  return (
    <div
    >
        <ProductPage product={product} />
    </div>
  );
}


export async function getServerSideProps(context){
    const productTitle=context.query.title?context.query.title:null
    const  productIndex= preview2.findIndex(x => x.title.trim() ===productTitle.trim() )

    return{
      props:{
        product:productIndex==-1?null :  preview2[productIndex]
    }
    }
  }
