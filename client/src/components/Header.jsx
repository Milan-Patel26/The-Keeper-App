import React from "react";

function Header() {

  function routeToLogin() {
    window.location.href = "/";
  }
  return (
    <header>
      <h1>Notes Keeper</h1>
      <button onClick={routeToLogin}>Logout</button>
    </header>
  );
}

export default Header;