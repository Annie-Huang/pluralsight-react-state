import React, {useEffect, useState} from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import Products from "./Products";
import {Routes, Route} from 'react-router-dom';
import Detail from "./Detail";
import Cart from "./Cart";

export default function App() {
  // const [cart, setCart] = useState([]);

  // Problem with this is: Default values are evaluated on every render!
  // const [cart, setCart] = useState(JSON.parse(localStorage.getItem('cart')));
  // Solution: Declare the default using a function. The function will only be run the first time the component render
  // const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('cart')));
  const [cart, setCart] = useState(() => {
    try { // try and catch is to prevent malformed data stored in local storage.
      return JSON.parse(localStorage.getItem('cart')) ?? [];  // Nullish coalescing operator (??)
    } catch {
      console.error('The cart could not be parsed into JSON');
      return []
    }
  });


  useEffect(() => localStorage.setItem('cart', JSON.stringify(cart)), [cart]);

  function addToCart(id, sku) {
    setCart(items => {
      const itemInCart = items.find(i => i.sku === sku);
      if (itemInCart) {
        // Return new array with the matching item replaced.
        return items.map(i => i.sku === sku ? {...i, quantity: i.quantity + 1} : i );

      } else {
        // Return new array with the new item appended
        return [...items, {id, sku, quantity: 1}];
      }

    });
  }

  function updateQuantity(sku, quantity) {
    setCart(items => {
      return quantity === 0
        ? items.filter(i => i.sku !== sku)
        : items.map(i => i.sku === sku ? {...i, quantity} : i );
    })
  }

  return (
    <>
      <div className="content">
        <Header />
        <main>
          <Routes>
            <Route path='/' element={<h1>Welcome to Carved Rock Fitness</h1>} />
            {/*Display the product's category in the URL using a placeholder.*/}
            <Route path='/:category' element={<Products />} />
            <Route path='/:category/:id' element={<Detail addToCart={addToCart} />} />
            <Route path='/cart' element={<Cart cart={cart} updateQuantity={updateQuantity} />} />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}
