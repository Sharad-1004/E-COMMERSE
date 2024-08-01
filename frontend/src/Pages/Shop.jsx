import React from 'react'
import Hero from '../Components/Hero/Hero'
import Popular from '../Components/Popular/Popular'
import Offers from '../Components/offers/Offers'
import NewCollection from '../Components/Newcollection/Newcollection'
import NewsLetter from '../Components/NewsLetter/NewsLetter'



const Shop = () => {
  return (
    <>
    <div>
        <div><Hero/></div>
      <div><Popular/></div>
      <div><Offers/></div>
      <div><NewCollection/></div>
      <div><NewsLetter/></div>
     
      
    </div>
    </>
  )
}

export default Shop
