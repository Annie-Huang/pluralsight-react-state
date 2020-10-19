import React from "react";
import {useParams} from 'react-router-dom';
import useFetch from "./services/useFetch";
import Spinner from "./Spinner";

export default function Detail() {
  // category is getting from <Route path='/:category/:id' element={<Detail />} />
  const {id} = useParams();
  const {data: product, error, loading} = useFetch(`products/${id}`);

  if (error) throw error;
  if (loading) return <Spinner />;

  return (
    <div id="detail">
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p id="price">${product.price}</p>
      <img src={`/images/${product.image}`} alt={product.category} />
    </div>
  );
}
