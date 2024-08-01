
import './App.css';
import Navbar from './Components/Navbar/Navbar';
import { BrowserRouter as Router,Routes,Route } from 'react-router-dom';
import Shop from './Pages/Shop';
import ShopCatagory from './Pages/ShopCatagory';
import Product from './Pages/Product';
import Cart from './Pages/Cart';
 import LoginSignup from './Pages/LoginSignup';
import Footer from './Components/Footer/Footer';
import men_banner from './Components/Asset/banner_mens.png'
import women_banner from './Components/Asset/banner_women.png'
import kid_banner from './Components/Asset/banner_kids.png'
import ShopContextProvider from './context/ShopContext';



function App() {
  return (
 <div >
  <ShopContextProvider>
   <Router>
  
  <Navbar/>
  <Routes>
  <Route path='/' element={<Shop/>}></Route>
  <Route path='/mens' element={<ShopCatagory banner={men_banner} category="men"/>}></Route>
    <Route path='/womens' element={<ShopCatagory banner={women_banner} category="women"/>}></Route>
    <Route path='/kids' element={<ShopCatagory banner={kid_banner} category="kid"/>}></Route>
    <Route path="/product/:productId" element ={<Product/>}>
   

  </Route>
  <Route path='/cart' element={<Cart/>}></Route>
   <Route path='/login' element={<LoginSignup/>}></Route>
   
  </Routes>
  <Footer/>
  </Router>
  </ShopContextProvider>
 </div>
    
  );
}

export default App;
