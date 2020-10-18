import React, {useEffect, useState} from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import {getProducts} from "./services/productService";

export default function App() {
  // You can see the value of the state in react dev top, click the 'App' and
  // useState calls are listed in the orcder they're declared.
  const [size, setSize] = useState(""); // array destructuring
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts('shoes')
      .then(response => setProducts(response))
      .catch(e => setError(e));
  }, []);

  function renderProduct(p) {
    return (
      <div key={p.id} className="product">
        <a href="/">
          <img src={`/images/${p.image}`} alt={p.name} />
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </a>
      </div>
    );
  }

  const filteredProducts = size
    ? products.filter(p => p.skus.find(s => s.size === parseInt(size)))
    : products;

  // get ErrorBoundary to handle async call error, which it doesn't handle by default.
  // But it only shows in prod. In development, the error stack displays over the error boundary.
  if (error) throw error;

  return (
    <>
      <div className="content">
        <Header />
        <main>
          <section id="filters">
            <label htmlFor="size">Filter by Size:</label>{" "}
            <select id="size" value={size} onChange={e => setSize(e.target.value)}>
              <option value="">All sizes</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
            </select>
            {size && <h2>Found {filteredProducts.length} items</h2>}
          </section>
          {/* map automatically passes each product to the renderProduct function. This is called a "point-free" style*/}
          <section id="products">{filteredProducts.map(renderProduct)}</section>
        </main>
      </div>
      <Footer />
    </>
  );
}
