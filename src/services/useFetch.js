import {useEffect, useState} from "react";

const baseUrl = process.env.REACT_APP_API_BASE_URL;

// Goal: Create a hook that makes it easy to make http calls
// The name must start with 'use'
// A hook is a Javascript function with a few extra rules
export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // getProducts('shoes')
    //   .then(response => setProducts(response))
    //   .catch(e => setError(e))
    //   .finally(() => setLoading(false)); // I thought finally only called in success. But seems to be called in error as well for promise.

    async function init() { // Async/await is syntactic sugar over promises. The two can interact.
      try {
        // const response = await getProducts('shoes');
        // setProducts(response);
        const response = await fetch(baseUrl + url);
        if (response.ok) {
          const json = await response.json();
          setData(json);
        } else {
          throw response;
        }

      } catch (e) {
        setError(e);
      } finally {
        setLoading(false)
      }
    }
    init();
  }, [url]);

  return {data, error, loading};
}
