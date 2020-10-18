// This is specified in the package.json command: e.g.
//     "start-app": "cross-env REACT_APP_API_BASE_URL=http://localhost:3001/ react-scripts start",
const baseUrl = process.env.REACT_APP_API_BASE_URL;

export async function getProducts(category) {
  const response = await fetch(baseUrl + "products?category=" + category);
  if (response.ok) return response.json();
  throw response;
}

export async function getProduct(id) {
  const response = await fetch(baseUrl + "products/" + id);
  if (response.ok) return response.json();
  throw response;
}
