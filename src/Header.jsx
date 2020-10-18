import React from "react";

// Link is like an anchor. But React Router handles the click so the page doesn't reload
// NavLink support custom styling (e.g. activeStyle) when the link is active
import {Link, NavLink} from "react-router-dom";

const activeStyle = {
  color: 'purple',
}

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li>
            <Link to='/'>
              <img alt="Carved Rock Fitness" src="/images/logo.png" />
            </Link>
          </li>
          <li>
            <NavLink activeStyle={activeStyle} to='/shoes'>Shoes</NavLink>
          </li>
          <li>
            <NavLink activeStyle={activeStyle} to='/cart'>Cart</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}
