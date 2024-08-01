import React, { useContext, useRef, useState } from 'react';
import './Navbar.css';

import logo from '../Asset/logo.png';
import cart_icon from '../Asset/cart_icon.png';
import { Link } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import nav_dropdown from '../Asset/dropdown-icon-png-7.png'

const Navbar = () => {
  const [menu, setMenu] = useState('shop');
  const {getTotalCartItems}=useContext(ShopContext);
  const menuRef=useRef();

  const dropdown_toggle=(e)=>{
    menuRef.current.classList.toggle('nav-menu-visible');
    e.target.classList.toggle('open');
  }
  return (
    <div className='navbar'>
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
        <p>SHOPPER</p>
      </div>
      <img className='nav-dropdown' onClick={dropdown_toggle} src={nav_dropdown} alt="" />
      <ul ref={menuRef} className='nav-menu'>
        <li onClick={() => setMenu('shop')}>
         <Link style={{textDecoration:'none'}} to='/'>Shop</Link>{menu === 'shop' ? <hr className="active-underline" /> : null}
        </li>
        <li onClick={() => setMenu('mens')}>
          <Link  style={{textDecoration:'none'}} to='/mens'>Men</Link>{menu === 'mens' ? <hr className="active-underline" /> : null}
        </li>
        <li onClick={() => setMenu('womens')}>
         <Link  style={{textDecoration:'none'}} to='/womens'>Women</Link> {menu === 'womens' ? <hr className="active-underline" /> : null}
        </li>
        <li onClick={() => setMenu('kids')}>
         <Link  style={{textDecoration:'none'}} to='/kids'>Kids<style></style></Link> {menu === 'kids' ? <hr className="active-underline" /> : null}
        </li>
      </ul>
      <div className='nav-login-cart'>
      {localStorage.getItem('auth-token')
        ? <button onClick={() => { localStorage.removeItem('auth-token'); window.location.replace('/'); }}>Logout</button>
        : <Link to='/login'><button>Login</button></Link>
      }
        
       <Link to='/cart'><img src={cart_icon} alt="Cart Icon" /></Link> 
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
}

export default Navbar;

