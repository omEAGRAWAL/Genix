import { useState } from "react";
import sign_up from "./asset/sign_in.png";
import Header from "./Header.jsx";
import Facebook from "./Facebook.jsx";
import Oauth from "./Oauth.jsx";
import { useEffect } from "react";

function Sign_Up() {
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/";
    }
  }, []);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem("token", result);
        window.location.href = "/";

        // Handle successful registration
        console.log("Registration successful");
      } else {
        // Handle errors
        console.log("Registration failed");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div>
      <Header />

      <div className="flex flex-row w-full">
        <div
          id="sign_in_form"
          className="pl-24 pt-7 w-1/2"
          style={{ height: 581, width: 400 }}
        >
          <form className="w-full" onSubmit={handleSignUp}>
            <div className="flex flex-col gap-5">
              <div>
                <h1 className="text-[#191D23] text-xl/[30px]">Login</h1>
              </div>
              <div>
                <p className="text-[#64748B] text-xs">
                  Welcome back. Enter your credentials to access your account{" "}
                </p>
              </div>

              <div>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="border border-black w-full rounded p-1"
                  placeholder="olivia@untitledui.com"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  name="password"
                  className="border border-black w-full rounded p-1"
                  id="password"
                  placeholder="********"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="bg-gradient-to-r from-[#1D4ED8] to-[#5AD7FE] w-full p-1 rounded-sm"
                >
                  Continue
                </button>
              </div>
              <div className="flex justify-center items-center">
                <p>----------or sign up with----------</p>
              </div>
              <div className="google apple facebook">
                <Facebook />
                <Oauth />
              </div>
              <div className="flex justify-center items-center text-lg">
                <p>
                  Don’t have an Account?{" "}
                  <a href="/signup" className="text-[#1D4ED8]">
                    Sign up here
                  </a>
                </p>
              </div>
            </div>
          </form>
        </div>
        <div className="flex justify-center items-center w-1/2">
          <img
            className="p-10 m-10"
            src={sign_up}
            alt="Sign Up"
            width="550px"
            height="500px"
          />
        </div>
      </div>
    </div>
  );
}

export default Sign_Up;
