import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  function handleCallbackResponse(response) {
    console.log(response.credentials);
    navigate("/home")
  }

  useEffect(() => {
    if (typeof google !== 'undefined' && google.accounts) {
      google.accounts.id.initialize({
        client_id: /* Insert Google OAuth Client ID Here */ "",
        callback: handleCallbackResponse
      });
  
      google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            document.cookie =  `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;
            google.accounts.id.prompt()
        }
    });

    } else {
      console.error('Google API not loaded.');
    }
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    try {
      const response = await fetch('http://localhost:5000/login', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
  
      const data = await response.json();
        if (response.ok) {
            localStorage.setItem('token', data.token);
            navigate("/home");
        } else {
            alert(data.message);
        }
    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };
  

  return (
    <div className="container">
      <h1>Login</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="formInput"
          name="email"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          value={email}
          required
        />
        <input
          className="formInput"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          value={password}
          required
        />
        <button type="submit" className="logres">Submit</button>
      </form>
      <p>Don't have an account?</p>
      <Link to="/register"><button className="logres">Register</button></Link>
    </div>
  );
}

export default Login;