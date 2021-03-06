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
  const [saveError, setSaveError] = useState(null); // saveError is the error from the API call when clicking the save button
  const [touched, setTouched] = useState({}); // touched object has the ID associate to each touched field


  // Derived state (derived most validation-related values)
  // Will reduced the amount of state we had to store. | Assures error state is valid because it recalculated on each render.
  const errors = getErrors(address); // errors object is the errors associate to each field
  const isValid = Object.keys(errors).length === 0;

  function handleChange(e) {
    // With functional set state, React deleted the event before we can access it.
    //   so it is necessary have this when accessing the event in functional set state calls.
    //   The error gives you good suggestion to resolve this so don't worry.
    // This isn't necessary in React 17 or newer since React 17 no longer pools events
    e.persist(); // persist the event. https://reactjs.org/docs/legacy-event-pooling.html

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

  function handleBlur(event) {
    event.persist();
    setTouched(cur => ({
      ...cur,
      [event.target.id]: true
    }))
  }

  // useEffect(() => {
  //   console.log('address=', address);
  //   console.log('touched=', touched);
  // }, [address, touched])

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

    } else {
      setStatus(STATUS.SUBMITTED);
    }
  }

  function getErrors(address) {
    const result = {}; // Keep error as object for easy access, same as touched
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
      {!isValid && status === STATUS.SUBMITTED &&
        <div role='alert'>
          <p>Please fix the following errors:</p>
          <ul>
            {Object.keys(errors).map(key => <li key={key}>{errors[key]}</li>)}
          </ul>
        </div>
      }
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
          <p role='alert'>
            {/*{(touched['city'] || status === STATUS.SUBMITTED) && errors['city']}*/}
            {(touched.city || status === STATUS.SUBMITTED) && errors.city}
          </p>
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
          <p role='alert'>
            {(touched.country || status === STATUS.SUBMITTED) && errors.country}
          </p>
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
