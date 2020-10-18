import React, {useState} from "react";
import Spinner from "./Spinner";
import useFetch from "./services/useFetch";
import {Link, useParams} from 'react-router-dom';
import PageNotFound from "./PageNotFound";

export default function Products() {
  // You can see the value of the state in react dev top, click the 'App' and
  // useState calls are listed in the orcder they're declared.
  const [size, setSize] = useState(""); // array destructuring

  // category is getting from <Route path='/:category' element={<Products />} />
  const {category} = useParams();

  const {data: products, error, loading} = useFetch("products?category=" + category)

  function renderProduct(p) {
    return (
      <div key={p.id} className="product">
        {/*<a href="/">*/}
        <Link to={`/${category}/${p.id}`}>
          <img src={`/images/${p.image}`} alt={p.name} />
          <h3>{p.name}</h3>
          <p>${p.price}</p>
        </Link>
      </div>
    );
  }

  const filteredProducts = size
    ? products.filter(p => p.skus.find(s => s.size === parseInt(size)))
    : products;

  // get ErrorBoundary to handle async call error, which it doesn't handle by default.
  // But it only shows in prod. In development, the error stack displays over the error boundary.
  if (error) throw error;

  if (loading) return <Spinner />; // There's nothing wrong with multiple return statements. These act like guard clauses.

  // It will return a [] for products?category=shoes2 because products in db.json is defined as a array.
  // If it's a object. e.g. products: {...}, it will return as {} and you will not get the .length property.
  // https://medium.com/codingthesmartway-com-blog/create-a-rest-api-with-json-server-36da8680136d
  if (products.length === 0) return <PageNotFound />

  return (
    <>
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
    </>
  );
}
