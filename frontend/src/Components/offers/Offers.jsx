import React from 'react'
import './Offers.css'
import exclusive_image from '../Asset/exclusive_image.png'

const Offers = () => {
  return (
    <div className='offers'>
      <div className="offers-left">
     <h1>Exclusive</h1>
     <h1>Offers for You</h1>
     <p>ONLY ON BEST SELLERS PRODUCT</p>
     <button>Cheack Now</button>
      </div>
      <div className="offers-right">
      <img src={exclusive_image} alt="" />
      </div>
    </div>
  )
}

export default Offers
