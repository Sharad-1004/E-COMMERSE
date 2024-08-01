import React from 'react'
import './Breadcrum.css'
import arrow_icon from '../Asset/breadcrum_arrow.png'
import PropTypes from 'prop-types'


const Breadcrum = (props) => {
    const {product} = props;
  return (
    <div className='breadcrum'>
      HOME <img src={arrow_icon} alt="" /> SHOP <img src={arrow_icon} alt="" /> {product.category} <img src={arrow_icon} alt="" /> {product.name}
    </div>
  )
};
Breadcrum.propTypes = {
  product: PropTypes.shape({
    category: PropTypes.string,
    name: PropTypes.string
  })
};

export default Breadcrum;


