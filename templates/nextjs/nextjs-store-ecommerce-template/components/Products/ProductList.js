import React from 'react'
import ProductThumbnail from '../ProductThumbnail'
export default function ProductList({products}) {

  return (
    <div className='grid grid-cols-1 items-center justify-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 2xl:grid-cols-5' >

        {
            products.map((res,i)=>(
                <div key={i} className="flex justify-center pb-5 sm:pb-7 ">
                <ProductThumbnail  product={res} />
                </div>
            ))
        }

    </div>
  )
}
