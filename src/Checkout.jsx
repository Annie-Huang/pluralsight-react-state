import React, {useEffect, useState} from "react";
import {saveShippingAddress} from "./services/shippingService";

const STATUS = {
  IDLE: "IDLE",
  SUBMITTING: "SUBMITTING",
  SUBMITTED: "SUBMITTED",
  COMPLETED: "COMPLETED",
}

// Declaring outside component to avoid recreation on each render
const emptyAddress = {
  city: "",
  country: "",
};

export default function Checkout({ cart, emptyCart }) {
  const [address, setAddress] = useState(emptyAddress);
  const [status, setStatus] = useState(STATUS.IDLE);
  const [saveError, setSaveError] = useState(null);

  // Derived state
  const errors = getErrors(address);
  const isValid = Object.keys(errors).length === 0;

  function handleChange(e) {
    // With functional set state, React deleted the event before we can access it.
    //   so it is necessary have this when accessing the event in functional set state calls.
    // This isn't necessary in React 17 or newer since React 17 no longer pools events
    e.persist(); // persist the event

    setAddress((curAddress) => {
      // if(e.currentTarget.id === 'city') {
      //   return {...curAddress, city: e.currentTarget.value}
      // }

      // So much cleaner approach. Javascript's computed property to reference a property using a variable.
      // It means use the inptu's id to determine which property to set (using computed property syntax)
      return {
        ...curAddress,
        [e.target.id]: e.target.value
      }
    })
  }

  // useEffect(() => {
  //   console.log(address);
  // }, [address])

  function handleBlur(event) {
    // TODO
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus(STATUS.SUBMITTING);

    // Only submit the form if it's valid. Otherwise, just set status to submitted.
    if (isValid) {
      try {
        await saveShippingAddress(address);
        emptyCart();
        setStatus(STATUS.COMPLETED);
      } catch (e) {
        setSaveError(e);
      }
    }
  }

  function getErrors(address) {
    const result = {};
    if (!address.city) result.city = 'City is required';
    if (!address.country) result.country = 'Country is required';
    return result;
  }

  if (saveError) throw saveError;
  if (status === STATUS.COMPLETED) {
    return <h1>Thanks for hopping!</h1>
  }

  return (
    <>
      <h1>Shipping Info</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="city">City</label>
          <br />
          <input
            id="city"
            type="text"
            value={address.city}
            onBlur={handleBlur}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="country">Country</label>
          <br />
          <select
            id="country"
            value={address.country}
            onBlur={handleBlur}
            onChange={handleChange}
          >
            <option value="">Select Country</option>
            <option value="China">China</option>
            <option value="India">India</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="USA">USA</option>
          </select>
        </div>

        <div>
          <input
            type="submit"
            className="btn btn-primary"
            value="Save Shipping Info"
            disabled={status === STATUS.SUBMITTING}
          />
        </div>
      </form>
    </>
  );
}
