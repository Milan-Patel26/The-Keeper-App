import React, { useEffect, useState } from "react";
import { Link , useNavigate} from "react-router-dom";

function Register() {
  const [name, setName] = useState("");
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

  async function handleSubmit(event) {
    event.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/register', {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ name, email, password })
      });

      const data = await response.text();
      if(data === "Missing Fields"){
        alert("Please fill out all fields.")
      }else if (data === 'Success') {
        navigate("/login");
      } else {
        alert("An error occured");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("An error occurred during login. Please try again.");
    };

  }
  

  return (
    <div className="container">
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input
          className="formInput"
          name="name"
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          value={name}
        />
        <input
          className="formInput"
          name="email"
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          value={email}
        />
        <input
          className="formInput"
          name="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          value={password}
        />
        <button type="submit" className="logres">Submit</button>
      </form>
      <Link to="/"><button className="logres">Login</button></Link>
    </div>
  );
}

export default Register;